const { Game } = require("../db/models"); // Assuming your models' index.js is in ../db/models
const asyncWrapper = require("../middleware/asyncWrapper");
const {
  createCustomError,
  CustomAPIError,
} = require("../middleware/customError");
const { createSession } = require("./session");
const sequelize = require("../db/models/index").sequelize;
const { Op } = require("sequelize");

//ROUTES -> '/games'
// GET
const getAllGames = asyncWrapper(async (req, res) => {
  const games = await Game.findAll();

  if (!games) {
    throw createCustomError("Could not retrieve games.", 404);
  }

  res.status(200).json(games);
});

//POST
// POST
const newGame = asyncWrapper(async (req, res) => {
  const {
    type,
    playerColor,
    playerWhiteTimeRemaining,
    playerBlackTimeRemaining,
    timeIncrement,
    sessionId,
  } = req.body;

  let playerWhiteSession = null;
  let playerBlackSession = null;
  let session = null;

  if (!sessionId) {
    // Create a new session if no sessionId is provided
    const { username } = req.body;
    session = await createSession(username);

    // Set the session cookie in the response
    res.cookie("session_token", session.token, {
      httpOnly: true,
      expires: session.expiresAt,
      secure: process.env.NODE_ENV === "production", // Ensures the cookie is only sent over HTTPS in production
      sameSite: "strict", // Mitigate CSRF attacks
    });
  } else {
    // Use the provided sessionId
    session = { id: sessionId };
  }

  // Set playerWhiteSession or playerBlackSession based on playerColor
  if (playerColor === "white") {
    playerWhiteSession = session.id;
  } else if (playerColor === "black") {
    playerBlackSession = session.id;
  }

  // Create a new game
  const game = await Game.create({
    type,
    playerWhiteSession,
    playerWhiteTimeRemaining,
    playerBlackSession,
    playerBlackTimeRemaining,
    timeIncrement,
  });

  if (!game) {
    throw createCustomError("Game unable to be created", 500);
  }

  res.status(201).json({ game });
});

//DELETE
const deleteAllGames = asyncWrapper(async (req, res) => {
  await Game.destroy({
    where: {},
  });
  res.status(200).json({ message: "All games deleted successfully." });
});

//ROUTES -> '/games/:id'
//GET
const getGame = asyncWrapper(async (req, res) => {
  const gameId = req.params.id;
  const game = await Game.findByPk(gameId);

  if (!game) {
    throw createCustomError("Game could not be found", 404);
  }
  res.status(200).json(game);
});

//DELETE
const deleteGame = asyncWrapper(async (req, res) => {
  const gameId = req.params.id;
  const game = await Game.findByPk(gameId);

  if (!game) {
    throw createCustomError(
      `Game with ${gameId} ID was unable to be found.`,
      404
    );
  }
  await game.destroy();
  res
    .status(200)
    .json({ message: `Game with ${gameId} ID successfully deleted` });
});

// GET
const isGameAvailable = asyncWrapper(async (req, res) => {
  console.log("hello from the backend!");
  const gameId = req.query.id;
  const orientation = req.query.orientation; //white or black

  const game = await Game.findByPk(gameId);
  if (!game) {
    return res
      .status(404)
      .json({ message: `Game could not be found with id ${gameId}` });
  }

  let isAvailable = false;

  // Does the game have less than two players and is the player color occupied?
  if (orientation === "white") {
    console.log(
      "Num Players:",
      game.numPlayers,
      "Player White:",
      game.playerWhite,
      "game.numplayers:",
      game.numPlayers < 2,
      "game.playerWhite",
      game.playerWhite === null
    );

    // is game available based on whether the correct session id is present ont he game table. Do this tomorrow...
    if (game.numPlayers < 2 && !game.playerWhiteSession === null) {
      isAvailable = true;
    }
  } else if (orientation === "black") {
    if (game.numPlayers < 2 && game.playerBlackSession === null) {
      isAvailable = true;
    }
  }
  console.log(isAvailable, game);
  res.status(200).json({ isAvailable: isAvailable, gameData: game });
});

// GET
const getAllGamesBySessionId = asyncWrapper(async (req, res) => {
  const sessionId = req.params.sessionId;

  const games = await Game.findAll({
    where: {
      [Op.or]: [
        { playerWhiteSession: sessionId },
        { playerBlackSession: sessionId },
      ],
    },
  });

  res.status(200).json({ games });
});

// UPDATE
const updateGameByID = asyncWrapper(async (req, res) => {
  const gameId = req.params.id;
  const { fen, whiteTime, blackTime } = req.body;
  const transaction = await sequelize.transaction();
  try {
    const game = await Game.findByPk(gameId); //find the game

    if (!game) {
      throw createCustomError(
        `Game with ${gameId} ID could not be found while trying to update.`,
        404
      );
    }

    await game.update({
      fen,
      playerWhiteTimeRemaining: whiteTime,
      playerBlackTimeRemaining: blackTime,
    });
    transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw createCustomError("Transaction failed.");
  }

  res
    .status(200)
    .json({ message: `Game with id ${gameId} successfully updated.` });
});

// FOR THESE INTERNAL METHODS USE TRANSACTIONS
// INTERNAL METHOD
const gameCapacity = async (gameId) => {
  const transaction = await sequelize.transaction();
  let game;

  try {
    game = await Game.findByPk(gameId, { transaction });
    if (!game) {
      throw createCustomError("Game could not be found", 404);
    }

    await transaction.commit();
  } catch (error) {
    if (transaction) await transaction.rollback();
    throw createCustomError("Transaction could not be completed");
  }
  return game.numPlayers;
};

// INTERNAL METHOD
const joinGame = async (gameId, orientation, sessionId) => {
  const transaction = await sequelize.transaction();
  try {
    const game = await Game.findByPk(gameId, { transaction });

    if (!game) {
      throw createCustomError("Game could not be found", 404);
    }

    // Game is available
    if (game.numPlayers < 2) {
      if (orientation === "white") {
        game.playerWhite = 0; // for now just set to mean an unidentified player
      } else if (orientation === "black") {
        game.playerBlack = 0;
      } else {
        throw createCustomError(
          "Invalid orientation value. It should be 'white' or 'black'.",
          400
        );
      }
      game.numPlayers += 1;
      await game.save({ transaction });
      await transaction.commit();
    } else {
      await transaction.rollback();
    }
  } catch (error) {
    await transaction.rollback();
    throw createCustomError("Transaction failed");
  }
};

// INTERNAL METHOD
const leaveGame = async (gameId, orientation) => {
  const transaction = await sequelize.transaction();
  try {
    const game = await Game.findByPk(gameId);

    if (!game) {
      throw createCustomError(
        `Game with id ${gameId} could not be found.`,
        404
      );
    }

    if (game.numPlayers > 0) {
      if (orientation === "white") {
        game.playerWhite = null; // reset the datapoint to null
      } else if (orientation === "black") {
        game.playerBlack = null;
      } else {
        throw createCustomError(
          "Invalid orientation value. It should be 'white' or 'black'.",
          400
        );
      }
      game.numPlayers -= 1;
      await game.save({ transaction });
      await transaction.commit();
    } else {
      await transaction.rollback();
    }
  } catch (error) {
    await transaction.rollback();
    throw createCustomError("Transaction failed");
  }
};

// INTERNAL METHOD
const updateGame = async (gameId, fen, whiteTime, blackTime) => {
  console.log("here in the backend!");
  const transaction = await sequelize.transaction();
  try {
    const game = await Game.findByPk(gameId); //find the game

    if (!game) {
      throw createCustomError(
        `Game with ${gameId} ID could not be found while trying to update.`,
        404
      );
    }

    await game.update({
      fen,
      playerWhiteTimeRemaining: whiteTime,
      playerBlackTimeRemaining: blackTime,
    });
    transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw createCustomError("Transaction failed.");
  }
};

module.exports = {
  getAllGames,
  newGame,
  deleteAllGames,
  getGame,
  deleteGame,
  updateGameByID,
  updateGame,
  joinGame,
  leaveGame,
  isGameAvailable,
  gameCapacity,
  updateGame,
  getAllGamesBySessionId,
};

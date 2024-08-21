const { Game } = require("../db/models"); // Assuming your models' index.js is in ../db/models
const asyncWrapper = require("../middleware/asyncWrapper");
const {
  createCustomError,
  CustomAPIError,
} = require("../middleware/customError");
const { checkCurrentSession } = require("./session");
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

// POST
const newGame = asyncWrapper(async (req, res) => {
  const {
    type,
    playerColor,
    playerWhiteTimeRemaining,
    playerBlackTimeRemaining,
    timeIncrement,
    sessionId,
    username,
  } = req.body;

  let playerWhiteSession = null;
  let playerBlackSession = null;

  // Handle session creation or username update
  let session = await checkCurrentSession(sessionId, username, res);

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
  const sessionId = req.query.sessionId;

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
      game.playerWhiteSession,
      "Session ID:",
      sessionId
    );

    // is game available based on whether the correct session id is present ont he game table. Do this tomorrow...
    if (!game.playerWhiteSession || game.playerWhiteSession === sessionId) {
      isAvailable = true;
    }
  } else if (orientation === "black") {
    if (!game.playerBlackSession || game.playerBlackSession === sessionId) {
      isAvailable = true;
    }
  }
  console.log(isAvailable, game);
  res.status(200).json({ isAvailable, game });
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
const setGameSessionId = async (gameId, orientation, sessionId) => {
  const transaction = await sequelize.transaction();
  try {
    const game = await Game.findByPk(gameId, { transaction });

    if (!game) {
      throw createCustomError("Game could not be found", 404);
    }

    // Game is available
    if (orientation === "white" && !game.playerWhiteSession) {
      game.playerWhiteSession = sessionId; // for now just set to mean an unidentified player
    } else if (orientation === "black" && !game.playerBlackSession) {
      game.playerBlackSession = sessionId;
    }

    await game.save({ transaction });
    await transaction.commit();
  } catch (error) {
    await transaction.rollback();
    throw createCustomError("Transaction failed");
  }
};

const increaseNumPlayers = async (gameId) => {
  const transaction = await sequelize.transaction();

  try {
    const game = await Game.findByPk(gameId, { transaction });

    if (!game) {
      throw createCustomError("Game could not be found", 404);
    }

    if (game.numPlayers < 2) {
      game.numPlayers += 1;
    }

    await game.save({ transaction });
    await transaction.commit();

    return game.numPlayers;
  } catch (error) {
    await transaction.rollback();
    throw createCustomError(`Transaction failed: ${error.message}`, 500);
  }
};

// INTERNAL METHOD
const decreaseNumPlayers = async (gameId) => {
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
      game.numPlayers -= 1;
    }

    await game.save({ transaction });
    await transaction.commit();

    return game.numPlayers;
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
  setGameSessionId,
  increaseNumPlayers,
  decreaseNumPlayers,
  isGameAvailable,
  gameCapacity,
  updateGame,
  getAllGamesBySessionId,
};

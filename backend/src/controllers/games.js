const { Game, Session } = require("../db/models"); // Assuming your models' index.js is in ../db/models
const asyncWrapper = require("../middleware/asyncWrapper");
const {
  createCustomError,
  CustomAPIError,
} = require("../middleware/customError");
const { checkAndUpdateCurrentSession, createSession } = require("./session");
const sequelize = require("../db/models/index").sequelize;
const { Op } = require("sequelize");

//ROUTES -> '/games'
// GET
const getAllGames = asyncWrapper(async (req, res) => {
  const games = await Game.findAll();

  if (!games) {
    throw createCustomError("Could not retrieve games.", 404);
  }

  res.status(200).json({ games });
});

// POST
const startNewGame = asyncWrapper(async (req, res) => {
  const {
    type,
    playerColor,
    playerWhiteTimeRemaining,
    playerBlackTimeRemaining,
    timeIncrement,
    sessionUsername,
    difficulty,
  } = req.body;

  let playerWhiteSession = null;
  let playerBlackSession = null;

  try {
    const session = await checkAndUpdateCurrentSession(
      req,
      res,
      sessionUsername
    );

    if (playerColor === "white") {
      playerWhiteSession = session.id;
    } else if (playerColor === "black") {
      playerBlackSession = session.id;
    } else {
      throw createCustomError(`that game color is not supported`, 404);
    }

    const game = await Game.create({
      type,
      playerWhiteSession,
      playerWhiteTimeRemaining,
      playerBlackSession,
      playerBlackTimeRemaining,
      timeIncrement,
      difficulty,
    });

    if (!game) {
      throw createCustomError(`error creating new game.`, 500);
    }

    res.status(200).json({ game });
  } catch (error) {
    throw createCustomError(
      `error in checking session and creating new game: ${error.message}`,
      500
    );
  }
});

const joinGame = asyncWrapper(async (req, res) => {
  const { gameId, orientation } = req.body;
  let { sessionId } = req.body;
  let session;
  console.log(
    "GAME ID",
    gameId,
    "Orientation:",
    orientation,
    "sessionId",
    sessionId
  );
  if (!sessionId) {
    session = await createSession(res, null);
    console.log("session", session);
    sessionId = session.id;
  }

  const game = await Game.findByPk(gameId);
  console.log(game.playerBlackSession);
  if (!game) {
    throw createCustomError(`error in finding game with ID: ${gameId}`, 404);
  }
  if (
    orientation === "white" &&
    (!game.playerWhiteSession || game.playerWhiteSession === sessionId)
  ) {
    game.playerWhiteSession = sessionId;
    console.log("Inside white if");
  } else if (
    orientation === "black" &&
    (!game.playerBlackSession || game.playerBlackSession === sessionId)
  ) {
    game.playerBlackSession = sessionId;
  } else {
    throw createCustomError(
      `tried to join a game where the user didn't belong`,
      400
    );
  }

  await game.save();
  res.status(200).json({ game, session });
});

//DELETE
const deleteAllGames = asyncWrapper(async (req, res) => {
  await Game.destroy({
    where: {},
  });
  res.status(200).json({ message: "all games deleted successfully." });
});

//ROUTES -> '/games/:id'
//GET
const getGame = asyncWrapper(async (req, res) => {
  const gameId = req.params.id;
  const game = await Game.findByPk(gameId);

  if (!game) {
    throw createCustomError("Game could not be found", 404);
  }
  res.status(200).json({ game });
});
//
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

const getGameHistory = asyncWrapper(async (req, res) => {
  const sessionId = req.params.sessionId;

  // Fetch games where the sessionId was either the white or black player
  const games = await Game.findAll({
    where: {
      [Op.or]: [
        { playerWhiteSession: sessionId },
        { playerBlackSession: sessionId },
      ],
    },
    include: [
      // Join with session to get playerWhiteSession username
      {
        model: Session,
        as: "whiteSession", // Use the alias defined in the model
        required: false, // Left join, so if session doesn't exist, null will be returned
        attributes: ["username"], // Select only the username
      },
      // Join with session to get playerBlackSession username
      {
        model: Session,
        as: "blackSession", // Use the alias defined in the model
        required: false,
        attributes: ["username"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  // Separate games into in-progress and completed
  const inProgressGames = [];
  const completedGames = [];

  // Add a field for the result (WIN, LOSS, TIE) based on sessionId
  games.forEach((game) => {
    let result;
    if (!game.winner) {
      result = "IN PROGRESS";
    } else if (game.winner === "TIE") {
      result = "TIE";
    } else if (game.winner === sessionId) {
      result = "WIN";
    } else {
      result = "LOSS";
    }

    // Determine opponent based on sessionId
    let opponent, orientation;
    if (game.playerWhiteSession === sessionId) {
      orientation = "white";
      opponent =
        game.type === "pvc"
          ? "Stockfish"
          : game.blackSession
          ? game.blackSession.username
          : null;
    } else if (game.playerBlackSession === sessionId) {
      orientation = "black";
      opponent =
        game.type === "pvc"
          ? "Stockfish"
          : game.whiteSession
          ? game.whiteSession.username
          : null;
    }

    const gameWithResult = {
      ...game.toJSON(),
      result, // Add the result field
      opponent,
      orientation,
    };

    // Sort games into in-progress and completed based on the result
    if (result === "IN PROGRESS") {
      inProgressGames.push(gameWithResult);
    } else {
      completedGames.push(gameWithResult);
    }
  });

  // Return the in-progress and completed games in separate arrays
  res.status(200).json({
    inProgressGames,
    completedGames,
  });
});

// GET
// UPDATE
const updateGameByID = asyncWrapper(async (req, res) => {
  const gameId = req.params.id;
  const { fen, whiteTime, blackTime } = req.body;
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

const increaseNumPlayers = async (gameId) => {
  try {
    const game = await Game.findByPk(gameId);

    if (!game) {
      throw createCustomError("Game could not be found", 404);
    }

    if (game.numPlayers < 2) {
      game.numPlayers += 1;
    } else {
      throw createCustomError(
        "Error increasing numPlayers in game with too many people",
        400
      );
    }

    await game.save();
    return game.numPlayers;
  } catch (error) {
    throw createCustomError(
      `error increasing numPlayers  ${error.message}`,
      500
    );
  }
};

// INTERNAL METHOD
const decreaseNumPlayers = async (gameId) => {
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
    } else {
      throw createCustomError(
        `error decreasing numPlayers in game with too few players`
      );
    }

    await game.save();
    return game.numPlayers;
  } catch (error) {
    throw createCustomError(`error decreasing numPlayers: ${error.message}`);
  }
};

// INTERNAL METHOD
const updateGame = async (gameId, fen, whiteTime, blackTime) => {
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
  } catch (error) {
    throw createCustomError("Transaction failed.");
  }
};

// INTERNAL METHOD
const setGameSessionId = async (gameId, orientation, sessionId) => {
  try {
    const game = await Game.findByPk(gameId);

    if (!game) {
      throw createCustomError(
        `Game with ${gameId} ID could not be found while trying to update.`,
        404
      );
    }
    if (orientation === "white") {
      await game.update({ playerWhiteSession: sessionId });
    } else if (orientation === "black") {
      await game.update({ playerBlackSession: sessionId });
    }
  } catch (error) {
    throw createCustomError("error in setting game sessionId", 500);
  }
};

module.exports = {
  getAllGames,
  startNewGame,
  deleteAllGames,
  getGame,
  deleteGame,
  updateGameByID,
  updateGame,
  joinGame,
  increaseNumPlayers,
  decreaseNumPlayers,
  gameCapacity,
  updateGame,
  getGameHistory,
  setGameSessionId,
};

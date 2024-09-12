const { Game, Session } = require("../db/models"); // Assuming your models' index.js is in ../db/models
const asyncWrapper = require("../middleware/asyncWrapper");
const {
  createCustomError,
  CustomAPIError,
} = require("../middleware/customError");
const { checkAndUpdateCurrentSession, createSession } = require("./session");
const sequelize = require("../db/models/index").sequelize;
const { Op, or } = require("sequelize");

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
    orientation,
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
      sessionUsername,
    );

    if (orientation === "white") {
      playerWhiteSession = session.id;
    } else if (orientation === "black") {
      playerBlackSession = session.id;
    } else {
      throw createCustomError(`that game color is not supported`, 404);
    }

    const game = await Game.create({
      type,
      playerWhiteSession,
      initialTime: playerWhiteTimeRemaining,
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
      500,
    );
  }
});

const joinGame = asyncWrapper(async (req, res) => {
  const { gameId, orientation } = req.body;
  let { sessionId } = req.body;
  let session;

  if (!sessionId) {
    session = await createSession(res, null);
    sessionId = session.id;
  }

  const game = await Game.findByPk(gameId, {
    include: [
      {
        model: Session,
        as: "whiteSession",
        attributes: ["username"],
      },
      {
        model: Session,
        as: "blackSession",
        attributes: ["username"],
      },
    ],
  });

  if (!game) {
    throw createCustomError(`error in finding game with ID: ${gameId}`, 404);
  }

  if (
    orientation === "white" &&
    (!game.playerWhiteSession || game.playerWhiteSession === sessionId) &&
    sessionId != game.playerBlackSession
  ) {
    game.playerWhiteSession = sessionId;
  } else if (
    orientation === "black" &&
    (!game.playerBlackSession || game.playerBlackSession === sessionId) &&
    sessionId != game.playerWhiteSession
  ) {
    game.playerBlackSession = sessionId;
  } else {
    throw createCustomError(
      `tried to join a game where the user didn't belong`,
      400,
    );
  }

  await game.save();
  res.status(200).json({ game, session });
});

const deleteAllGames = asyncWrapper(async (req, res) => {
  await Game.destroy({
    where: {},
  });
  res.status(200).json({ message: "all games deleted successfully." });
});

const getGame = asyncWrapper(async (req, res) => {
  const gameId = req.params.id;
  const game = await Game.findByPk(gameId);

  if (!game) {
    throw createCustomError("Game could not be found", 404);
  }
  res.status(200).json({ game });
});

const deleteGame = asyncWrapper(async (req, res) => {
  const gameId = req.params.id;
  const game = await Game.findByPk(gameId);

  if (!game) {
    throw createCustomError(
      `Game with ${gameId} ID was unable to be found.`,
      404,
    );
  }
  await game.destroy();
  res
    .status(200)
    .json({ message: `Game with ${gameId} ID successfully deleted` });
});

const getGameHistory = asyncWrapper(async (req, res) => {
  const sessionId = req.params.sessionId;

  const games = await Game.findAll({
    where: {
      [Op.or]: [
        { playerWhiteSession: sessionId },
        { playerBlackSession: sessionId },
      ],
    },
    include: [
      {
        model: Session,
        as: "whiteSession",
        required: false,
        attributes: ["username"],
      },
      {
        model: Session,
        as: "blackSession",
        required: false,
        attributes: ["username"],
      },
    ],
    order: [["createdAt", "DESC"]],
  });

  // Separate games into in-progress and completed
  const inProgressGames = [];
  const completedGames = [];

  games.forEach((game) => {
    let outcome;
    if (!game.winner) {
      outcome = "IN PROGRESS";
    } else if (game.winner === "draw") {
      outcome = "DRAW";
    } else if (
      (game.playerWhiteSession === sessionId && game.winner === "white") ||
      (game.playwerBlackSession === sessionId && game.winner === "black")
    ) {
      outcome = "WIN";
    } else {
      outcome = "LOSS";
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
      outcome,
      opponent,
      orientation,
    };

    if (outcome === "IN PROGRESS") {
      inProgressGames.push(gameWithResult);
    } else {
      completedGames.push(gameWithResult);
    }
  });

  res.status(200).json({
    inProgressGames,
    completedGames,
  });
});

const updateGameByID = asyncWrapper(async (req, res) => {
  const gameId = req.params.id;
  const { fen, whiteTime, blackTime } = req.body;
  try {
    const game = await Game.findByPk(gameId);

    if (!game) {
      throw createCustomError(
        `Game with ${gameId} ID could not be found while trying to update.`,
        404,
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

const updateGame = async (
  gameId,
  fen,
  whiteTime,
  blackTime,
  winner,
  result,
) => {
  try {
    const game = await Game.findByPk(gameId);

    if (!game) {
      throw createCustomError(
        `Game with ${gameId} ID could not be found while trying to update.`,
        404,
      );
    }

    const updateData = {};

    if (fen) {
      updateData.fen = fen;
    }

    if (whiteTime != null && blackTime != null) {
      updateData.playerWhiteTimeRemaining = whiteTime;
      updateData.playerBlackTimeRemaining = blackTime;
    }

    if (winner) {
      updateData.winner = winner;
      updateData.result = result;
    }

    console.log("updateData:", updateData);

    if (Object.keys(updateData).length > 0) {
      await game.update(updateData);
    }
  } catch (error) {
    console.error("Error updating the game:", error.message);
    throw createCustomError("Transaction failed.");
  }
};

const setGameSessionId = async (gameId, orientation, sessionId) => {
  try {
    const game = await Game.findByPk(gameId);

    if (!game) {
      throw createCustomError(
        `Game with ${gameId} ID could not be found while trying to update.`,
        404,
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
  updateGame,
  getGameHistory,
  setGameSessionId,
};

const express = require("express");
const router = express.Router();

const {
  getAllGames,
  startNewGame,
  deleteAllGames,
  getGame,
  deleteGame,
  getGameHistory,
  joinGame,
  updateGameByID,
} = require("../controllers/games");

router.route("/").get(getAllGames).post(startNewGame).delete(deleteAllGames);
router.route("/:id").get(getGame).delete(deleteGame).patch(updateGameByID);
router.route("/join").post(joinGame);
router.route("/session/:sessionId").get(getGameHistory);

module.exports = router;

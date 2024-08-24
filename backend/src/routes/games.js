const express = require("express");
const router = express.Router();

const {
  getAllGames,
  newGame,
  deleteAllGames,
  getGame,
  deleteGame,
  getAllGamesBySessionId,
  joinGame,
  updateGameByID,
} = require("../controllers/games");

router.route("/").get(getAllGames).post(newGame).delete(deleteAllGames);
router.route("/:id").get(getGame).delete(deleteGame).patch(updateGameByID);
router.route("/join").post(joinGame);
router.route("/session/:sessionId").get(getAllGamesBySessionId);

module.exports = router;

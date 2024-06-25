const express = require('express');
const router = express.Router();

const {
    getAllGames,
    newGame,
    deleteAllGames,
    getGame,
    deleteGame,
    updateGame,
    joinGame
} = require('../controllers/games');

router.route('/').get(getAllGames).post(newGame).delete(deleteAllGames); 
router.route('/:id').get(getGame).post(joinGame).delete(deleteGame).put(updateGame);

module.exports = router;
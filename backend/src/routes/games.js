const express = require('express');
const router = express.Router();

const {
    getAllGames,
    newGame,
    deleteAllGames,
    getGame,
    deleteGame,
    updateGame,
    isGameAvailable
} = require('../controllers/games');

// IMPORTANTLY THIS ROUTE NEEDS TO BE PASSED FIRST
router.route('/check-game-availability').get(isGameAvailable);

router.route('/').get(getAllGames).post(newGame).delete(deleteAllGames); 
router.route('/:id').get(getGame).delete(deleteGame).put(updateGame);


module.exports = router;
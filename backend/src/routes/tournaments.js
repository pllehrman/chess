const express = require('express');
const router = express.Router();

const {
    newTournament,
    deleteTournament
} = require('../controllers/tournaments');

router.route('/').post(newTournament);
router.route('/:id').delete(deleteTournament);
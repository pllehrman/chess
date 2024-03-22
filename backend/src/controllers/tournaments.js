const { Tournament } = require('../db/models/Tournament');
const asyncWrapper = require('../middleware/asyncWrapper');
const { createCustomError } = require('../middleware/customError');


// ROUTE -> '/tournaments'
// GET
const getAllTournaments = asyncWrapper(async(req, res) => {
    const tournaments = await Tournament.findAll();

    if (!tournaments){
        throw createCustomError('Tournaments could not be retrieved.', 500);
    }

    res.status(200).json(tournaments);
});

// POST
const newTournament = asyncWrapper(async (req, res) => {
    const tournamentDetails = req.body;

    const tournament = await Tournament.create({ tournamentDetails });

    if (!tournament) {
        throw createCustomError('Tournament unable to be created.', 500);
    }

    res.status(200).json(tournament);
});

// DELETE
const deleteAllTournaments = asyncWrapper(async (req, res) => {
    await Tournament.destroy({
        where: {}
    });

    res.status(200).json({message: 'All Tournaments deleted successfully.'});
})

//ROUTE '/games/:id'
// GET
const getTournament = asyncWrapper(async (req, res) => {
    const tournamentId = req.params.id;
    const tournament = Tournament.findByPk(tournamentId);

    if (!tournament){
        throw createCustomError(`Tournament with ID ${tournamentId} unable to found and deleted.`);
    }
    await tournament.destroy();
    res.status(200).json({message: 'Tournament successfully deleted.'})
})

// PUT
const updateTournament = asyncWrapper(async (req, res) => {
    const tournamentDetails = req.body;
    const tournamentId = req.params.id;
    const tournament = Tournament.findByPk(tournamentId);

    if (!tournament){
        throw createCustomError(`Tournament with ID ${tournamentId} could not be located and updated.`)
    }

    await tournament.update({tournamentDetails});
    res.status(200).json(tournament);
})

// DELETE
const deleteTournament = asyncWrapper(async (req, res) => {
    const tournamentId = req.params.id;

    const tournament = Tournament.findByPk(tournamentId);

    if (!tournament) {
        throw createCustomError(`Unable to find and delete tournament with ID ${tournamentId}`);
    }

    await tournament.destroy();
    res.status(200).json({message: 'Tournament deleted successfully.'})
});

module.exports = {
    getAllTournaments,
    newTournament,
    deleteAllTournaments,
    getTournament,
    updateTournament,
    deleteTournament
}

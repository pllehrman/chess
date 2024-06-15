const { Game } = require('../db/models'); // Assuming your models' index.js is in ../db/models
const asyncWrapper = require('../middleware/asyncWrapper')
const { createCustomError } = require('../middleware/customError')

//ROUTES -> '/games'
// GET
const getAllGames = asyncWrapper( async (req, res) => {
    const games = await Game.findAll();

    if (!games){
        throw createCustomError('Could not retrieve games.', 404);
    }

    res.status(200).json(games)
});

//POST
const newGame = asyncWrapper( async (req, res) => {
    const details = req.body; // type (of game), playerWhite, playerWhiteTimeRemaining, playerBlack, playerBlackTimeRemaining
    console.log(details)
    const game = await Game.create(details); //no need to pass in anything here as of now
    
    if (!game) {
        throw createCustomError('Game unable to be created', 500);
    }

    res.status(201).json({game});
});

//DELETE
const deleteAllGames = asyncWrapper( async (req, res) => {
    await Game.destroy({
        where: {}
    });
    res.status(200).json({ message: "All games deleted successfully."});
});

//ROUTES -> '/games/:id'
//GET
const getGame = asyncWrapper( async (req, res) => {
    const gameId = req.params.id;
    const game = await Game.findByPk(gameId);

    if (!game) {
        throw createCustomError('Game could not be found', 404);
    }

    res.status(200).json(game);
});

//DELETE
const deleteGame = asyncWrapper( async (req, res) => {
    const gameId = req.params.id;
    const game = await Game.findByPk(gameId);

    if (!game) {
        throw createCustomError(`Game with ${gameId} ID was unable to be found.`, 404);
    }
    await game.destroy();
    res.status(200).json({ message: `Game with ${gameId} ID successfully deleted`});
})

//PUT
const updateGame = asyncWrapper( async (req, res) => {
    const gameId = req.params.id;
    const { gameDetails } = req.body; //destructure the updated fields

    const game = await Game.findByPk(gameId); //find the game

    if (!game){
        throw createCustomError(`Game with ${gameId} ID could not be found while trying to update.`, 404);
    }

    await game.update(gameDetails); //update it
    res.status(200).json(game); //send it back to the user
});

module.exports = {
    getAllGames,
    newGame,
    deleteAllGames,
    getGame,
    deleteGame,
    updateGame
}
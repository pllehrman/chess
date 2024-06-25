const { Game } = require('../db/models'); // Assuming your models' index.js is in ../db/models
const asyncWrapper = require('../middleware/asyncWrapper');
const { createCustomError, CustomAPIError } = require('../middleware/customError');
const sequelize = require('../db/models/index').sequelize;

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

// GET
const isGameAvailable = asyncWrapper( async(req, res) => {
    const gameId = req.query.id;
    const game = await Game.findByPk(gameId);

    if (!game) {
        throw createCustomError(`Game could not be found with id ${gameId}`, 404);
    }

    if (game.numPlayers < 2) {
        res.status(200).json({isAvailable: true});
    } else {
        res.status(200).json({isAvailable: false});
    }
});

// INTERNAL METHOD
const joinGame = asyncWrapper( async (gameId) => {
    const transaction = await sequelize.transaction();
    
    try {
        const game = await Game.findByPk(gameId, { transaction } )
        
        if(!game) {
            throw createCustomError('Game could not be found', 404);
        }

        // Game is available
        if (game.numPlayers < 2) {
            game.numPlayers += 1
            await game.save({ transaction });

            await transaction.commit();
        } else {
            await transaction.rollback();
        }
    } catch (error) {
        await transaction.rollback();
        throw createCustomError("Transaction failed")
    }
});

const leaveGame = asyncWrapper( async(gameId) => {
    const game = await Game.findByPk(gameId);
    
    if (!game) {
        throw createCustomError(`Game with id ${gameId} could not be found.`, 404);
    }

    if (game.numPlayers > 0) {
        game.numPlayers -= 1;
        await game.save();
    } else {
        throw createCustomError(`Game with id ${gameId} already has no players.`, 400);
    }
});

module.exports = {
    getAllGames,
    newGame,
    deleteAllGames,
    getGame,
    deleteGame,
    updateGame,
    joinGame,
    leaveGame,
    isGameAvailable
}
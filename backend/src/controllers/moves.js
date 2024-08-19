const { Move } = require('../db/models')
const asyncWrapper = require('../middleware/asyncWrapper')
const { createCustomError, CustomAPIError } = require('../middleware/customError')
const sequelize = require('../db/models/index').sequelize

const getMovesByGameId = asyncWrapper(async (req, res) => {
  const gameId = req.params.id
  const moves = await Move.findAll({
    where: {
      game_id: gameId
    },
    order: [['created_at', 'ASC']]
  })

  res.status(200).json({ moves })
})

const newMove = asyncWrapper(async (req, res) => {
  const moveDetails = req.body
  const move = await Move.create(moveDetails)

  if (!move) {
    throw createCustomError('Unable to create move', 500)
  }

  res.status(200).json({ move })
})

module.exports = {
  getMovesByGameId,
  newMove
}

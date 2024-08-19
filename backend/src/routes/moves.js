const express = require('express')
const router = express.Router()

const {
  getMovesByGameId,
  newMove
} = require('../controllers/moves')

router.route('/').post(newMove)
router.route('/:id').get(getMovesByGameId)

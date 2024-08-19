const crypto = require('crypto')

function generateNonce (req, res, next) {
  res.locals.nonce = crypto.randomBytes(16).toString('base64')
  next()
}

module.exports = generateNonce

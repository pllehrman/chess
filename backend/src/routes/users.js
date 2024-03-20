const express = require('express');
const router = express.Router();

const {
    newUser,
    validateUserEmail
} = require('../controllers/users');

router.route('/').post(newUser);
router.route('/check-email').get(validateUserEmail)

module.exports = router;
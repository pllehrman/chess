const express = require('express');
const router = express.Router();

const {
    newUser,
    validateUserEmail,
    deleteUser
} = require('../controllers/users');

router.route('/').post(newUser);
router.route('/:id').delete(deleteUser);
router.route('/check-email').get(validateUserEmail);

module.exports = router;
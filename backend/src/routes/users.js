const express = require('express');
const router = express.Router();

const {
    newUser,
    validateUserEmail,
    validateUserPassword,
    deleteUser
} = require('../controllers/users');

router.route('/').post(newUser);
router.route('/:id').delete(deleteUser);
router.route('/check-email').get(validateUserEmail);
router.route('/check-password').post(validateUserPassword);

module.exports = router;
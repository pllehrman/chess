const { User } = require('../db/models');
const { createCustomError } = require('../middleware/customError');
const asyncWrapper = require('../middleware/asyncWrapper');

// ROUTES -> '/users'
// POST
const newUser = asyncWrapper( async (req, res) => {
    const userDetails  = req.body; //This contains firstname, lastname, and email

    const user = await User.create(userDetails);

    if (!user) {
        throw createCustomError(`User unable to be created with ${userDetails} details.`, 500);
    }

    res.status(200).json(user);
});

// ROUTES -> '/users/check-email'
// GET
const validateUserEmail = asyncWrapper(async (req, res) => {
    const email = req.query.email;
    console.log(email);
    const user = await User.findOne({
        where: {
            email: email
        }
    });

    if (user) {
        console.log("Exists!")
        res.status(200).json({isUnique: true});
    } else {
        console.log("Doesn't exist!")
        res.status(200).json({isUnique: false});
    }
})

module.exports = {
    newUser,
    validateUserEmail
}
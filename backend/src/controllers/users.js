const argon2 = require('argon2');
const { Session, User } = require('../db/models');
const { createCustomError, CustomAPIError } = require('../middleware/customError');
const asyncWrapper = require('../middleware/asyncWrapper');
const jwt = require('jsonwebtoken');

// ROUTES -> '/users'
// POST
const newUser = asyncWrapper( async (req, res) => {
    const { firstname, lastname, email, password } = req.body;
    try {
        const hashedPassword = await argon2.hash(password);
        
        const user = await User.create({
            firstname,
            lastname,
            email,
            hashed_password: hashedPassword
        });

    if (!user) {
        throw createCustomError(`User unable to be created with provided details.`, 500);
    }
    
    const sessionToken = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, { expiresIn: '1h' });

    console.log(sessionToken)

    const session = await Session.create({
        token: sessionToken,
        userId: user.id,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24) //24 hours
    });

    // Setting the cookie in the browser's document
    res.cookie('session', sessionToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 1000 * 60 * 60 * 24,
    });

    // Sending the user and sessionToken to frontend
    res.status(201).json({ session });

    } catch (error) {
        throw createCustomError(`Error creating user: ${error.message}`, 500);
    }
});

// ROUTES -> '/users/check-email'
// GET
const validateUserEmail = asyncWrapper(async (req, res) => {
    const email = req.query.email;
    
    const user = await User.findOne({
        where: {
            email: email
        }
    });

    if (user) {
        // console.log("Exists!")
        res.status(200).json({isUnique: true});
    } else {
        // console.log("Doesn't exist!")
        res.status(200).json({isUnique: false});
    }
});

// ROUTES -> '/users/check-password'
// POST -> this is due to the fact that it's more secure to send password in the body of POST requests
const validateUserPassword = asyncWrapper(async (req, res) => {
    const { email, password } = req.body;

    // Validate input data
    if (!email || !password) {
        throw createCustomError('Email and password are required', 400);
    }

    const user = await User.findOne({
        where: {
            email: email
        }
    });

    if (!user) {
        throw createCustomError(`Unable to find user with email ${email}.`, 404);
    } 
   
    const isMatch = await argon2.verify(user.hashed_password, password);

    if (isMatch) {
        // console.log("Passwords do match!")
        res.status(200).json({"isMatch": true});
    } else {
        // console.log("Password's don't match!")
        res.status(200).json({"isMatch": false});
    }
});

// ROUTES -> '/users/:id'
// DELETE
const deleteUser = asyncWrapper(async (req, res) => {
    const userId = req.params.id;
    const user = await User.findByPk(userId);

    if (!user){
        throw createCustomError(`User with id ${userId} unable to be found and deleted.`, 404);
    }
    
    await user.destroy();
    res.status(200).json({ message : `User with ${userId} ID successfully deleted.`})
});

module.exports = {
    newUser,
    validateUserEmail,
    validateUserPassword,
    deleteUser
}
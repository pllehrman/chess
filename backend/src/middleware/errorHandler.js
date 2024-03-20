const { CustomAPIError } = require('./customError');

const errorHandler = (err, req, res, next) => {
    let statusCode = 500;
    let message = 'Something went wrong';

    if (err instanceof CustomAPIError) {
        statusCode = err.statusCode;
        message = err.message;
    }

    res.status(statusCode).json({ message });
};

module.exports = errorHandler;

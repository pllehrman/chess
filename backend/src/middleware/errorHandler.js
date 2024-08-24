const { CustomAPIError } = require("./customError");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({
      message: err.message,
    });
  }

  res.status(500).json({ message: "Internal Server Error" });
};

module.exports = errorHandler;

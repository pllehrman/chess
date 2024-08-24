const { CustomAPIError } = require("./customError");

const errorHandler = (err, req, res, next) => {
  console.error(err.stack);

  if (err instanceof CustomAPIError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  res.status(500).json({ success: false, message: "Internal Server Error" });
};

module.exports = errorHandler;

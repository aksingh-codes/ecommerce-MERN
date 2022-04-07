const ErrorHandler = require("../utils/errorHandler")

module.exports = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal Server Error";

    // Wrong MongoDB ID error
    if(err.name === "CastError") {
        const message  = `Resource not found. Invalid: ${err.path}`
        err = new ErrorHandler(message, 400)
    }

    // Mongoose Duplicate key error
    if (err.code === 11000) {
        const message = `Duplicate ${Object.keys(err.keyValue)} Entered`
        err = new ErrorHandler(message, 400)
    }

    // JSON WEBToken Error
    if (err.name === "JsonWebTokenError") {
        const message = `Json Web token is invalid, try again`
        err = new ErrorHandler(message, 400) 
    }

    // JWT Expired Error
    if (err.name === "TokenExpiredError") {
        const message = `Json Web token is expired, try again`
        err = new ErrorHandler(message, 400) 
    }

    res.status(err.statusCode).json({
        success: false,
        message: err.message
    })
}
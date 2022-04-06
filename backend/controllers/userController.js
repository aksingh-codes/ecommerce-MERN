const catchAsyncError = require("../middleware/catchAsyncError");
const User = require("../models/userModel")
const ErrorHandler = require("../utils/errorHandler")

// Register a User
exports.registerUser = catchAsyncError(async (req, res, next) => {
    const {name, email, password} = req.body


    const user = await User.create({
        name,
        email,
        password,
        avatar: {
            publicID: "smaple id",
            url: "ProfileURL"
        }
    })

    res.status(201).json({
        success: true,
        user
    })
})
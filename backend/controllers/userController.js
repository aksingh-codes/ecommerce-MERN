const catchAsyncError = require("../middleware/catchAsyncError")
const User = require("../models/userModel")
const ErrorHandler = require("../utils/errorHandler")
const sendToken = require("../utils/jwtToken")
const sendEmail = require("../utils/sendEmail.js")
const crypto = require("crypto")

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

    sendToken(user, 201, res)
})

// Login User
exports.loginUser = catchAsyncError(async (req, res, next) => {
    const {email, password} = req.body

    // checking if user has given both email and password
    if (!email || !password) {
        return next(new ErrorHandler("Please Enter Email & Password"), 400)
    }

    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        return next(new ErrorHandler("Invalid email or password"), 401)
    }

    const isPasswordMatched = await user.comparePassword(password)

    if (!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password"), 401)
    }
    
    sendToken(user, 200, res)
})

// Logout User
exports.logout = catchAsyncError(async (req, res, next) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})

// Forgot Password
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
    const user = await User.findOne({
        email: req.body.email
    })

    if(!user) {
        return next(new ErrorHandler("User not found", 404))
    }

    // Get Password reset token
    const resetToken = user.getResetPasswordToken()
    await user.save({
        validateBeforeSave: false
    })

    const resetPasswordURL = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${resetToken}`

    const message = `Your password reset token is: \n\n${resetPasswordURL} \n\nIf you haven't requested this email then, please ignore it.`

    try {
        await sendEmail({
            email: user.email,
            subject: `MERN Ecommerce Password Recovery`,
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to ${user.email} successfully`
        })
    } 
    catch(error) {
        user.resetPasswordToken = undefined
        user.resetPasswordExpire = undefined

        await user.save({
            validateBeforeSave: false
        })

        return next(new ErrorHandler(error.message, 500))
    }

})


// Reset Password
exports.resetPassword = catchAsyncError(async (req, res, next) => {
    // creating token hash
    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(req.params.token)
        .digest("hex")

    const user = await User.findOne({
        resetPasswordToken,
        resetPasswordExpire: {
            $gt: Date.now()
        }
    })

    if(!user) {
        return next(new ErrorHandler(
            "Reset Password Token is invalid or has been expired", 400
        ))
    }

    if(req.body.password !== req.body.confirmPassword) {
        return next(new ErrorHandler(
            "Password does not match", 400
        ))
    }

    user.password = req.body.password
    user.resetPasswordToken = undefined
    user.resetPasswordExpire = undefined

    await user.save()

    sendToken(user, 200, res)
})
const bcrypt = require("bcryptjs")
const mongoose = require("mongoose")
const validator = require("validator")

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            "Please Enter Your Name"
        ],
        maxlength: [
            30,
            "Name cannot exceed 30 characters"
        ],
        minlength: [
            4,
            "Name should have more than 4 characters"
        ]
    },
    email: {
        type: String,
        required: [
            true,
            "Please Enter Your Email"
        ],
        unique: true,
        validate: [
            validator.isEmail,
            "Please Enter A Valid Email"
        ]
    },
    password: {
        type: String,
        required: [
            true,
            "Please Enter Your Password"
        ],
        minlength: [
            8,
            "Name should have greater than 8 characters"
        ],
        select: false
    },
    avatar: {
        publicID: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        default: "user"
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
})

// pre is event run whenever schema is saved
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) { // password is not modified
        next()
    }
    this.password = await bcrypt.hash(this.password, 10)
})

module.exports = mongoose.model("User", userSchema)
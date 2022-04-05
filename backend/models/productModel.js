const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [
            true,
            "Please enter product name"
        ]
    },
    description: {
        type: String,
        required: [
            true,
            "Please enter product description"
        ]
    },
    price: {
        type: Number,
        required: [
            true,
            "Please enter product Price"
        ],
        maxlength: [
            8,
            "Price cannot exceed 8 characters"
        ]
    },
    rating: {
        type: Number,
        default: 0
    },
    images: [ 
        {
            publicID: {
                type: String,
                required: true
            },
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [
            true,
            "Please enter product category"
        ]
    },
    stock: {
        type: Number,
        required: [
            true, 
            "Please enter product stock"
        ],
        maxlength: [
            4,
            "Stock cannot exceed 4 characters",
        ],
        default: 1
    },
    numberOfReviews: {
        type: Number,
        default: 0
    },
    reviews: [
        {
            name: {
                type: String,
                required: true
            },
            rating: {
                type: Number,
                required: true
            },
            comment: {
                type: String,
                required: true
            },
            required: false
        }
    ],
    createdAt: {
        type: Date,
        default: Date.now
    }


})

module.exports = mongoose.model("Product", productSchema)
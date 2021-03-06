const catchAsyncError = require("../middleware/catchAsyncError");
const Product = require("../models/productModel")
const ErrorHandler = require("../utils/errorHandler")
const ApiFeatures = require("../utils/apiFeatures")

// Create Product -- ADMIN
exports.createProduct = catchAsyncError(async (req, res, next) => {
    req.body.user = req.user
    const product = await Product.create(req.body);

    res.status(201).json({
        success: true,
        product
    })
})

// Get All Products
exports.getAllProducts = catchAsyncError(async (req, res) => {
    const resultPerPage = 5
    const apiFeatures = new ApiFeatures(Product.find(), req.query)
        .search()
        .filter()
        .pagination(resultPerPage)

    const products = await apiFeatures.query
 
    res.status(200).json({
        success: true,
        products
    })
})

// Get Product Details
exports.getProductDetails = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.params.id)

    if(!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    res.status(200).json({
        success: true,
        product
    })
})

// Update Product -- ADMIN
exports.updateProduct = catchAsyncError(async(req, res, next) => {
    let product = Product.findById(req.params.id)
    
    if(!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    product = await Product.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
            new: true,
            runValidators: true,
            useFindAndModify: false
        }
    )

    res.status(200).json({
        success: true,
        product
    })
})

// Delete Product - ADMIN
exports.deleteProduct = catchAsyncError(async(req, res, next) => {
    const product = await Product.findById(req.params.id)

    if(!product) {
        return next(new ErrorHandler("Product not found", 404))
    }

    await product.remove()

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})
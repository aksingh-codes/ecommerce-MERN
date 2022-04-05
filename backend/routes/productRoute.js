const express = require("express")
const { getAllProducts, createProduct, updateProduct, deleteProduct, getProductDetails } = require("../controllers/productController")

const router = express.Router()

router.route("/products").get(getAllProducts)
router.route("/products/new").post(createProduct)
router.route("/products/:id").get(getProductDetails).put(updateProduct).delete(deleteProduct)


module.exports = router
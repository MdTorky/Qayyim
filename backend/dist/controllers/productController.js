"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProductReview = exports.updateProduct = exports.createProduct = exports.deleteProduct = exports.getProductById = exports.getProducts = void 0;
const productModel_1 = __importDefault(require("../models/productModel"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = (0, asyncHandler_1.default)(async (req, res) => {
    const keyword = req.query.keyword
        ? {
            name: {
                $regex: req.query.keyword,
                $options: 'i',
            },
        }
        : {};
    const products = await productModel_1.default.find({ ...keyword });
    res.json(products);
});
exports.getProducts = getProducts;
// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = (0, asyncHandler_1.default)(async (req, res) => {
    const product = await productModel_1.default.findById(req.params.id);
    if (product) {
        res.json(product);
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
});
exports.getProductById = getProductById;
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = (0, asyncHandler_1.default)(async (req, res) => {
    const product = await productModel_1.default.findById(req.params.id);
    if (product) {
        await productModel_1.default.deleteOne({ _id: product._id });
        res.json({ message: 'Product removed' });
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
});
exports.deleteProduct = deleteProduct;
// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = (0, asyncHandler_1.default)(async (req, res) => {
    const product = new productModel_1.default({
        name: 'Sample name',
        price: 0,
        user: req.user?._id,
        image: ['/images/sample.jpg'],
        category: 'Clothing',
        productType: 'Physical',
        gender: 'Unisex',
        countInStock: 0,
        numReviews: 0,
        description: 'Sample description',
        sizes: ['M'],
        colors: ['Black'],
        isFeatured: false
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
});
exports.createProduct = createProduct;
// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = (0, asyncHandler_1.default)(async (req, res) => {
    const { name, price, description, image, category, productType, gender, countInStock, sizes, colors, isFeatured } = req.body;
    const product = await productModel_1.default.findById(req.params.id);
    if (product) {
        product.name = name;
        product.price = price;
        product.description = description;
        product.image = image;
        product.category = category;
        product.productType = productType;
        product.gender = gender;
        product.countInStock = countInStock;
        product.sizes = sizes;
        product.colors = colors;
        product.isFeatured = isFeatured;
        const updatedProduct = await product.save();
        res.json(updatedProduct);
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
});
exports.updateProduct = updateProduct;
// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = (0, asyncHandler_1.default)(async (req, res) => {
    const { rating, comment } = req.body;
    const product = await productModel_1.default.findById(req.params.id);
    if (product) {
        res.status(400).json({ message: 'Review feature pending update' });
    }
    else {
        res.status(404);
        throw new Error('Product not found');
    }
});
exports.createProductReview = createProductReview;

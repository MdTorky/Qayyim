"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateCart = exports.getCart = exports.toggleWishlist = exports.getWishlist = exports.deleteUser = exports.getUsers = exports.updateUserProfile = exports.getUserProfile = exports.registerUser = exports.authUser = void 0;
const userModel_1 = __importDefault(require("../models/userModel"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const asyncHandler_1 = __importDefault(require("../middleware/asyncHandler"));
// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = (0, asyncHandler_1.default)(async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel_1.default.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: (0, generateToken_1.default)(user._id),
        });
    }
    else {
        res.status(401);
        throw new Error('Invalid email or password');
    }
});
exports.authUser = authUser;
// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = (0, asyncHandler_1.default)(async (req, res) => {
    const { name, email, password } = req.body;
    const userExists = await userModel_1.default.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error('User already exists');
    }
    const user = await userModel_1.default.create({
        name,
        email,
        password,
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: (0, generateToken_1.default)(user._id),
        });
    }
    else {
        res.status(400);
        throw new Error('Invalid user data');
    }
});
exports.registerUser = registerUser;
// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await userModel_1.default.findById(req.user?._id);
    if (user) {
        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.getUserProfile = getUserProfile;
// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await userModel_1.default.findById(req.user?._id);
    if (user) {
        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        if (req.body.password) {
            user.password = req.body.password;
        }
        const updatedUser = await user.save();
        res.json({
            _id: updatedUser._id,
            name: updatedUser.name,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            token: (0, generateToken_1.default)(updatedUser._id),
        });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.updateUserProfile = updateUserProfile;
// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = (0, asyncHandler_1.default)(async (req, res) => {
    const users = await userModel_1.default.find({});
    res.json(users);
});
exports.getUsers = getUsers;
// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await userModel_1.default.findById(req.params.id);
    if (user) {
        await user.deleteOne(); // or remove() depending on Mongoose version, deleteOne is safer in newer
        res.json({ message: 'User removed' });
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.deleteUser = deleteUser;
// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await userModel_1.default.findById(req.user?._id).populate('wishlist');
    if (user) {
        res.json(user.wishlist);
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.getWishlist = getWishlist;
// @desc    Update user wishlist (add/remove)
// @route   POST /api/users/wishlist
// @access  Private
const toggleWishlist = (0, asyncHandler_1.default)(async (req, res) => {
    const { productId } = req.body;
    const user = await userModel_1.default.findById(req.user?._id);
    if (user) {
        // Check if product already in wishlist
        const index = user.wishlist.indexOf(productId);
        if (index > -1) {
            // Remove
            user.wishlist.splice(index, 1);
        }
        else {
            // Add
            user.wishlist.push(productId);
        }
        await user.save();
        // Return updated populated wishlist
        const updatedUser = await userModel_1.default.findById(req.user?._id).populate('wishlist');
        res.json(updatedUser?.wishlist);
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.toggleWishlist = toggleWishlist;
// @desc    Get user cart
// @route   GET /api/users/cart
// @access  Private
const getCart = (0, asyncHandler_1.default)(async (req, res) => {
    const user = await userModel_1.default.findById(req.user?._id);
    if (user) {
        res.json(user.cart);
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.getCart = getCart;
// @desc    Update user cart
// @route   PUT /api/users/cart
// @access  Private
const updateCart = (0, asyncHandler_1.default)(async (req, res) => {
    const { cartItems } = req.body;
    const user = await userModel_1.default.findById(req.user?._id);
    if (user) {
        user.cart = cartItems;
        await user.save();
        res.json(user.cart);
    }
    else {
        res.status(404);
        throw new Error('User not found');
    }
});
exports.updateCart = updateCart;

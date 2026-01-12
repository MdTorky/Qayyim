import { Request, Response } from 'express';
import Product from '../models/productModel';
import { ProtectedRequest } from '../middleware/authMiddleware';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req: Request, res: Response) => {
  const keyword = req.query.keyword
    ? {
        name: {
          $regex: req.query.keyword,
          $options: 'i',
        },
      }
    : {};

  const products = await Product.find({ ...keyword });
  res.json(products);
});

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req: Request, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const product = new Product({
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

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const {
    name,
    price,
    description,
    image,
    category,
    productType,
    gender,
    countInStock,
    sizes,
    colors,
    isFeatured
  } = req.body;

  const product = await Product.findById(req.params.id);

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
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

// @desc    Create new review
// @route   POST /api/products/:id/reviews
// @access  Private
const createProductReview = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    res.status(400).json({ message: 'Review feature pending update' });
  } else {
    res.status(404);
    throw new Error('Product not found');
  }
});

export {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
  createProductReview,
};

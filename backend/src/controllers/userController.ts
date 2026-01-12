import { Request, Response } from 'express';
import User from '../models/userModel';
import generateToken from '../utils/generateToken';
import { ProtectedRequest } from '../middleware/authMiddleware';
import asyncHandler from '../middleware/asyncHandler';

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
const authUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      addresses: user.addresses,
      token: generateToken(user._id as unknown as string),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
const registerUser = asyncHandler(async (req: Request, res: Response) => {
  const { name, email, password, phone } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    phone,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      addresses: user.addresses,
      token: generateToken(user._id as unknown as string),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
});

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
const getUserProfile = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const user = await User.findById(req.user?._id);

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      isAdmin: user.isAdmin,
      addresses: user.addresses,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
const updateUserProfile = asyncHandler(async (req: ProtectedRequest, res: Response) => {
  const user = await User.findById(req.user?._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.phone = req.body.phone || user.phone;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      isAdmin: updatedUser.isAdmin,
      addresses: updatedUser.addresses,
      token: generateToken(updatedUser._id as unknown as string),
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

// @desc    Get all users
// @route   GET /api/users
// @access  Private/Admin
const getUsers = asyncHandler(async (req: Request, res: Response) => {
    const users = await User.find({});
    res.json(users);
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
const deleteUser = asyncHandler(async (req: Request, res: Response) => {
    const user = await User.findById(req.params.id);

    if(user) {
        await user.deleteOne(); // or remove() depending on Mongoose version, deleteOne is safer in newer
        res.json({ message: 'User removed' });
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user wishlist
// @route   GET /api/users/wishlist
// @access  Private
const getWishlist = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const user = await User.findById(req.user?._id).populate('wishlist');

    if (user) {
        res.json(user.wishlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user wishlist (add/remove)
// @route   POST /api/users/wishlist
// @access  Private
const toggleWishlist = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const { productId } = req.body;
    const user = await User.findById(req.user?._id);

    if (user) {
        // Check if product already in wishlist
        const index = user.wishlist.indexOf(productId);

        if (index > -1) {
            // Remove
            user.wishlist.splice(index, 1);
        } else {
            // Add
            user.wishlist.push(productId);
        }

        await user.save();
        
        // Return updated populated wishlist
        const updatedUser = await User.findById(req.user?._id).populate('wishlist');
        res.json(updatedUser?.wishlist);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Get user cart
// @route   GET /api/users/cart
// @access  Private
const getCart = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const user = await User.findById(req.user?._id);

    if (user) {
        res.json(user.cart);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update user cart
// @route   PUT /api/users/cart
// @access  Private
const updateCart = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const { cartItems } = req.body;
    const user = await User.findById(req.user?._id);

    if (user) {
        user.cart = cartItems;
        await user.save();
        res.json(user.cart);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Add address to user profile
// @route   POST /api/users/profile/address
// @access  Private
const addAddress = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const { address, city, postalCode, country, isDefault } = req.body;
    const user = await User.findById(req.user?._id);

    if (user) {
        const newAddress = { address, city, postalCode, country, isDefault: isDefault || false };

        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push(newAddress as any);
        await user.save();
        res.status(201).json(user.addresses);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Remove address from user profile
// @route   DELETE /api/users/profile/address/:id
// @access  Private
const removeAddress = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const user = await User.findById(req.user?._id);

    if (user) {
        user.addresses = user.addresses.filter(addr => (addr as any)._id.toString() !== req.params.id);
        await user.save();
        res.json(user.addresses);
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

// @desc    Update address in user profile
// @route   PUT /api/users/profile/address/:id
// @access  Private
const updateAddress = asyncHandler(async (req: ProtectedRequest, res: Response) => {
    const { address, city, postalCode, country, isDefault } = req.body;
    const user = await User.findById(req.user?._id);

    if (user) {
        const addressIndex = user.addresses.findIndex(addr => (addr as any)._id.toString() === req.params.id);

        if (addressIndex > -1) {
            if (isDefault) {
                user.addresses.forEach(addr => addr.isDefault = false);
            }

            user.addresses[addressIndex] = {
                ...user.addresses[addressIndex],
                address: address || user.addresses[addressIndex].address,
                city: city || user.addresses[addressIndex].city,
                postalCode: postalCode || user.addresses[addressIndex].postalCode,
                country: country || user.addresses[addressIndex].country,
                isDefault: isDefault !== undefined ? isDefault : user.addresses[addressIndex].isDefault,
            };

            await user.save();
            res.json(user.addresses);
        } else {
             res.status(404);
             throw new Error('Address not found');
        }
    } else {
        res.status(404);
        throw new Error('User not found');
    }
});

export { authUser, registerUser, getUserProfile, updateUserProfile, getUsers, deleteUser, getWishlist, toggleWishlist, getCart, updateCart, addAddress, removeAddress, updateAddress };

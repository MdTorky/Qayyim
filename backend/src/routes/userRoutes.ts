import express from 'express';
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile,
  getUsers,
  deleteUser,
  getWishlist,
  toggleWishlist,
  getCart,
  updateCart,
  addAddress,
  removeAddress,
  updateAddress,
} from '../controllers/userController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(registerUser).get(protect, admin, getUsers);
router.post('/login', authUser);
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);
  
router.route('/profile/address').post(protect, addAddress);
router.route('/profile/address/:id').delete(protect, removeAddress).put(protect, updateAddress);

router
    .route('/:id')
    .delete(protect, admin, deleteUser);

router
  .route('/wishlist')
  .get(protect, getWishlist)
  .post(protect, toggleWishlist);

router
  .route('/cart')
  .get(protect, getCart)
  .put(protect, updateCart);

export default router;

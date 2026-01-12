import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  isAdmin: boolean;
  wishlist: mongoose.Types.ObjectId[];
  /* eslint-disable @typescript-eslint/no-explicit-any */
  cart: {
    product: mongoose.Types.ObjectId;
    name: string;
    image: string;
    price: number;
    qty: number;
    countInStock: number;
    size?: string;
    color?: string;
  }[];
  /* eslint-enable @typescript-eslint/no-explicit-any */
  addresses: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }[];
  isVerified: boolean;
  phone?: string;
  matchPassword: (enteredPassword: string) => Promise<boolean>;
}

const userSchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    isAdmin: {
      type: Boolean,
      required: true,
      default: false,
    },
    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        name: { type: String, required: true },
        image: { type: String, required: true },
        price: { type: Number, required: true },
        qty: { type: Number, required: true },
        countInStock: { type: Number, required: true },
        size: { type: String },
        color: { type: String },
      },
    ],
    addresses: [
        {
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
            country: { type: String, required: true },
            isDefault: { type: Boolean, default: false },
        }
    ],
    isVerified: {
      type: Boolean,
      required: true,
      default: false,
    },
    phone: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.methods.matchPassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
});

const User = mongoose.model<IUser>('User', userSchema);

export default User;

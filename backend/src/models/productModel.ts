import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  user: mongoose.Types.ObjectId;
  name: string;
  image: string[];
  description: string;
  category: string;
  productType: string;
  gender: string;
  sizes: string[];
  colors: string[];
  price: number;
  countInStock: number;
  isFeatured: boolean;
  rating: number;
  numReviews: number;
}

const productSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    image: [
      {
        type: String,
        required: true,
      },
    ],
    description: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    productType: {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true,
        enum: ['Men', 'Women', 'Unisex', 'Kids'],
        default: 'Unisex'
    },
    sizes: [
        {
            type: String,
            required: true
        }
    ],
    colors: [
        {
            type: String,
            required: true
        }
    ],
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      type: Number,
      required: true,
      default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    rating: {
      type: Number,
      required: true,
      default: 0,
    },
    numReviews: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;

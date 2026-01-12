export interface Product {
    _id: string; // Qayyim uses _id
    id?: string; // For compatibility
    name: string;
    nameAr?: string;
    description?: string;
    descriptionAr?: string;
    price: number;
    originalPrice?: number;
    category: string;
    gender?: string;
    sizes?: string[];
    colors?: string[] | ProductColor[];
    image: string[] | string;
    images?: string[]; // compatibility
    quantity?: number;
    countInStock?: number;
    isFeatured?: boolean;
    newArrival?: boolean;
    createdAt?: string | Date;
}

export interface ProductColor {
    name: string;
    nameAr?: string;
    hex: string;
}

export interface Order {
    _id: string;
    user: string;
    orderItems: OrderItem[];
    shippingAddress: ShippingInfo;
    paymentMethod: string;
    paymentResult?: {
        id: string;
        status: string;
        update_time: string;
        email_address: string;
    };
    taxPrice: number;
    shippingPrice: number;
    totalPrice: number;
    isPaid: boolean;
    paidAt?: string;
    isDelivered: boolean;
    deliveredAt?: string;
    orderStatus: OrderStatus;
    createdAt: string;
}

export interface OrderItem {
    name: string;
    qty: number;
    image: string;
    price: number;
    product: string;
    size?: string;
    color?: string;
}

export type OrderStatus = "pending" | "processing" | "shipped" | "delivered" | "cancelled";

export interface ShippingInfo {
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

export interface FilterState {
    gender: string[];
    category: string[];
    size: string[];
    color: string[];
    priceRange: [number, number];
}

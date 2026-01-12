import { createContext, useState, useContext, type ReactNode, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useLanguage } from './LanguageContext';
import { toast } from "@/hooks/use-toast";
import api from '../utils/api';

interface CartItem {
    product: string;
    name: string;
    image: string;
    price: number;
    qty: number;
    countInStock: number;
    size: string;
    color: string;
}

interface CartContextType {
    cartItems: CartItem[];
    shippingAddress: any;
    paymentMethod: string;
    addToCart: (item: CartItem) => void;
    removeFromCart: (id: string) => void;
    clearCart: () => void;
    saveShippingAddress: (address: any) => void;
    savePaymentMethod: (method: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const { language } = useLanguage();
    const [cartItems, setCartItems] = useState<CartItem[]>(() => {
        const storedCart = localStorage.getItem('cartItems');
        return storedCart ? JSON.parse(storedCart) : [];
    });
    const [shippingAddress, setShippingAddress] = useState(() => {
        const storedAddress = localStorage.getItem('shippingAddress');
        return storedAddress ? JSON.parse(storedAddress) : { address: '', city: '', postalCode: '', country: '' };
    });
    const [paymentMethod, setPaymentMethod] = useState(() => {
        const storedMethod = localStorage.getItem('paymentMethod');
        return storedMethod ? JSON.parse(storedMethod) : 'CashOnDelivery';
    });
    const [isLoaded, setIsLoaded] = useState(false);

    // Fetch cart from API when user logs in
    useEffect(() => {
        if (user) {
            const fetchCart = async () => {
                try {
                    const { data } = await api.get('/users/cart');
                    // Transform backend format to frontend format if needed
                    // Backend has product as ObjectId, frontend expects string
                    // But usually for cart updates we just need the array.
                    // Let's assume the structure is compatible or map it.
                    // Specifically, backend `product` is ObjectId, frontend `product` is string ID.
                    const mappedCart = data.map((item: any) => ({
                        ...item,
                        product: item.product._id || item.product // handle population or raw ID
                    }));
                    setCartItems(mappedCart);
                    localStorage.setItem('cartItems', JSON.stringify(mappedCart));
                } catch (error) {
                    console.error('Failed to fetch cart', error);
                } finally {
                    setIsLoaded(true);
                }
            };
            fetchCart();
        } else {
            // Guest mode: load from local storage (already done in initial state, but if logging out...)
            setIsLoaded(true);
        }
    }, [user]);

    // Sync to local storage matches Sync to DB
    useEffect(() => {
        localStorage.setItem('cartItems', JSON.stringify(cartItems));

        if (user && isLoaded) {
            const syncCart = async () => {
                try {
                    // Send pure data, ensuring product is ID
                    await api.put('/users/cart', { cartItems });
                } catch (error) {
                    console.error('Failed to sync cart', error);
                }
            };
            // Debounce could be good here, but for now direct call
            const timeoutId = setTimeout(() => syncCart(), 500);
            return () => clearTimeout(timeoutId);
        }
    }, [cartItems, user, isLoaded]);

    const addToCart = (item: CartItem) => {
        if (!user) {
            toast({
                variant: "destructive",
                title: language === "ar" ? "تسجيل الدخول مطلوب" : "Login Required",
                description: language === "ar" ? "يرجى تسجيل الدخول لإضافة المنتجات إلى السلة" : "Please login to add items to cart",
            });
            return;
        }

        const existItem = cartItems.find((x) => x.product === item.product && x.size === item.size && x.color === item.color);

        if (existItem) {
            setCartItems(
                cartItems.map((x) =>
                    x.product === existItem.product && x.size === existItem.size && x.color === existItem.color ? item : x
                )
            );
        } else {
            setCartItems([...cartItems, item]);
        }
    };

    const removeFromCart = (id: string) => {
        setCartItems(cartItems.filter((x) => x.product !== id));
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cartItems');
    };

    const saveShippingAddress = (address: any) => {
        setShippingAddress(address);
        localStorage.setItem('shippingAddress', JSON.stringify(address));
    };

    const savePaymentMethod = (method: string) => {
        setPaymentMethod(method);
        localStorage.setItem('paymentMethod', JSON.stringify(method));
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            shippingAddress,
            paymentMethod,
            addToCart,
            removeFromCart,
            clearCart,
            saveShippingAddress,
            savePaymentMethod
        }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};

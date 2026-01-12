import { useEffect, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from "@/hooks/use-toast";
import api from '../utils/api';
import PageTransition from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import { MapPin, CreditCard, ShoppingBag, ArrowRight, Edit2 } from 'lucide-react';
import { getShippingFee } from '@/config/shippingRates';

const PlaceOrderPage = () => {
    const { cartItems, shippingAddress, paymentMethod, clearCart } = useCart();
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const navigate = useNavigate();

    // Calculations
    const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);

    // Dynamic Shipping Fee Calculation
    const shippingPrice = useMemo(() => {
        return getShippingFee(shippingAddress.city, itemsPrice);
    }, [shippingAddress.city, itemsPrice]);

    const taxPrice = 0;
    const totalPrice = itemsPrice + shippingPrice + taxPrice;

    useEffect(() => {
        // ...
        if (!shippingAddress.address) {
            navigate('/shipping');
        } else if (!paymentMethod) {
            navigate('/payment');
        }
    }, [shippingAddress, paymentMethod, navigate]);

    const placeOrderHandler = async () => {
        try {
            const res = await api.post('/orders', {
                orderItems: cartItems,
                shippingAddress,
                paymentMethod,
                itemsPrice,
                shippingPrice,
                taxPrice,
                totalPrice,
            });

            clearCart();
            toast({
                title: t.common.success,
                description: language === "ar" ? "تم طلبك بنجاح" : "Order placed successfully",
            });
            navigate(`/order/${res.data._id}`);
        } catch (err: any) {
            toast({
                variant: 'destructive',
                title: t.common.error,
                description: err.response?.data?.message || err.message,
            });
        }
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50/50 pb-20">
                <div className="brand-container py-12">
                    <CheckoutSteps currentStep={4} />

                    <div className="text-center mb-8">
                        <h1 className="text-2xl font-bold">{t.checkout.review || (language === 'ar' ? 'مراجعة الطلب' : 'Review Order')}</h1>
                        <p className="text-gray-500 text-sm">{language === 'ar' ? 'الرجاء مراجعة تفاصيل طلبك قبل التأكيد' : 'Please review your order details before confirming'}</p>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-6">
                            {/* Shipping & Payment Summary Card */}
                            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h2 className="font-bold flex items-center gap-2">
                                        <MapPin className="w-4 h-4 text-gray-500" />
                                        {language === 'ar' ? 'التوصيل والدفع' : 'Delivery & Payment'}
                                    </h2>
                                </div>
                                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-sm font-medium text-gray-500">{t.cart.shipping}</h3>
                                            <Link to="/shipping" className="text-xs text-black underline font-medium hover:text-gray-600">
                                                {language === 'ar' ? 'تعديل' : 'Change'}
                                            </Link>
                                        </div>
                                        <div className="text-sm">
                                            <p className="font-semibold">{shippingAddress.address}</p>
                                            <p>{shippingAddress.city}, {shippingAddress.postalCode}</p>
                                            <p>{shippingAddress.country}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-sm font-medium text-gray-500">{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</h3>
                                            <Link to="/payment" className="text-xs text-black underline font-medium hover:text-gray-600">
                                                {language === 'ar' ? 'تعديل' : 'Change'}
                                            </Link>
                                        </div>
                                        <div className="text-sm flex items-center gap-2">
                                            <CreditCard className="w-4 h-4 text-green-600" />
                                            <p className="font-semibold">
                                                {paymentMethod === 'CashOnDelivery' ? (language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery') : paymentMethod}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                                    <h2 className="font-bold flex items-center gap-2">
                                        <ShoppingBag className="w-4 h-4 text-gray-500" />
                                        {language === 'ar' ? 'المنتجات' : 'Items'} <span className="text-xs font-normal text-gray-400">({cartItems.length})</span>
                                    </h2>
                                    <Link to="/cart" className="text-xs text-black underline font-medium hover:text-gray-600 flex items-center gap-1">
                                        <Edit2 className="w-3 h-3" />
                                        {language === 'ar' ? 'تعديل السلة' : 'Edit Cart'}
                                    </Link>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {cartItems.map((item, index) => (
                                        <div key={index} className="p-4 flex gap-4 hover:bg-gray-50/30 transition-colors">
                                            <div className="w-20 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 flex flex-col justify-center">
                                                <Link to={`/product/${item.product}`} className="font-bold text-gray-900 hover:underline line-clamp-1">
                                                    {item.name}
                                                </Link>
                                                <div className="text-sm text-gray-500 mt-1">
                                                    {item.size && <span className="bg-gray-100 px-2 py-0.5 rounded text-xs mr-2">{item.size}</span>}
                                                    {item.color && <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">{item.color}</span>}
                                                </div>
                                                <div className="flex justify-between items-end mt-2">
                                                    <p className="text-sm text-gray-500">
                                                        Qty: <span className="font-medium text-black">{item.qty}</span>
                                                    </p>
                                                    <p className="font-bold text-black">
                                                        {(item.qty * item.price).toLocaleString()} {t.common.egp}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="lg:col-span-1">
                            <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm sticky top-24">
                                <h2 className="text-xl font-bold mb-6">{t.cart.orderSummary}</h2>
                                <div className="space-y-3 text-sm mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t.cart.subtotal}</span>
                                        <span className="font-medium">{itemsPrice.toLocaleString()} {t.common.egp}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t.cart.shipping}</span>
                                        {shippingPrice === 0 ? (
                                            <span className="text-green-600 font-bold">{language === 'ar' ? 'مجاني' : 'Free'}</span>
                                        ) : (
                                            <span>{shippingPrice.toLocaleString()} {t.common.egp}</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t.cart.tax}</span>
                                        <span>{taxPrice.toFixed(2)} {t.common.egp}</span>
                                    </div>
                                </div>
                                <Separator className="my-6 bg-gray-100" />
                                <div className="flex justify-between mb-8">
                                    <span className="text-lg font-bold">{t.cart.total}</span>
                                    <span className="text-2xl font-bold">{totalPrice.toLocaleString()} <span className="text-sm font-normal text-gray-500">{t.common.egp}</span></span>
                                </div>
                                <Button
                                    className="w-full h-14 text-lg brand-button-accent rounded-full font-bold shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all transform hover:-translate-y-0.5"
                                    disabled={cartItems.length === 0}
                                    onClick={placeOrderHandler}
                                >
                                    {language === 'ar' ? 'تأكيد الطلب' : 'Place Order'}
                                    <ArrowRight className="ml-2 w-5 h-5" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default PlaceOrderPage;

import { useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight, Truck } from "lucide-react";

const CartPage = () => {
    const { cartItems, removeFromCart, addToCart } = useCart();
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const total = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const freeShippingThreshold = 2000; // Example threshold
    const progress = Math.min((total / freeShippingThreshold) * 100, 100);
    const remainingForFreeShipping = freeShippingThreshold - total;

    const checkoutHandler = () => {
        if (!user) {
            navigate('/login?redirect=shipping');
        } else {
            navigate('/shipping');
        }
    };

    if (cartItems.length === 0) {
        return (
            <PageTransition>
                <div className="min-h-[70vh] flex flex-col items-center justify-center p-4">
                    <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                        <ShoppingBag className="w-10 h-10 text-gray-300" />
                    </div>
                    <h2 className="text-2xl font-bold mb-2">{t.cart.emptyTitle}</h2>
                    <p className="text-gray-500 mb-8 max-w-sm text-center">{t.cart.emptyMessage}</p>
                    <Button asChild className="brand-button-accent px-8 h-12">
                        <Link to="/products">
                            {t.cart.startShopping}
                        </Link>
                    </Button>
                </div>
            </PageTransition>
        );
    }

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50/50 pb-20">
                <div className="brand-container py-12">
                    <h1 className="text-3xl font-bold mb-8 flex items-baseline gap-3">
                        {t.cart.title}
                        <span className="text-lg font-normal text-gray-500">
                            ({cartItems.reduce((acc, item) => acc + item.qty, 0)} {t.cart.itemsCount})
                        </span>
                    </h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 md:gap-12">
                        {/* Cart Items List */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Free Shipping Bar */}
                            {/* <div className="bg-white border border-gray-100 p-6 rounded-xl shadow-sm mb-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-black text-white rounded-full">
                                        <Truck className="w-4 h-4" />
                                    </div>
                                    <p className="font-medium">
                                        {total >= freeShippingThreshold ? (
                                            <span className="text-green-600 font-bold">{language === 'ar' ? 'مبارك! لقد حصلت على شحن مجاني' : 'Yay! You qualify for FREE Shipping'}</span>
                                        ) : (
                                            <span>
                                                {language === 'ar' ? 'أضف' : 'Add'} <span className="font-bold">{remainingForFreeShipping.toLocaleString()} {t.common.egp}</span> {language === 'ar' ? 'للحصول على شحن مجاني' : 'to get Free Shipping'}
                                            </span>
                                        )}
                                    </p>
                                </div>
                                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-black transition-all duration-1000 ease-out rounded-full"
                                        style={{ width: `${progress}%` }}
                                    />
                                </div>
                            </div> */}

                            <div className="space-y-4">
                                {cartItems.map((item) => (
                                    <div key={`${item.product}-${item.size}-${item.color}`} className="group bg-white border border-gray-100 rounded-xl p-4 sm:p-5 flex gap-4 sm:gap-6 shadow-sm hover:shadow-md transition-all duration-300">
                                        {/* Image */}
                                        <div className="w-28 h-36 aspect-[3/4] bg-gray-100 shrink-0 rounded-lg overflow-hidden relative">
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>

                                        {/* Details */}
                                        <div className="flex-1 flex flex-col justify-between py-1">
                                            <div>
                                                <div className="flex justify-between items-start mb-2">
                                                    <Link to={`/product/${item.product}`} className="font-bold text-lg hover:underline line-clamp-2 leading-tight">
                                                        {item.name}
                                                    </Link>
                                                    <p className="font-bold text-lg hidden sm:block whitespace-nowrap">
                                                        {(item.price * item.qty).toLocaleString()} {t.common.egp}
                                                    </p>
                                                </div>
                                                <div className="text-sm text-gray-500 space-y-1">
                                                    {item.size && <p className="flex items-center gap-1">{t.products.size}: <span className="font-medium text-black bg-gray-100 px-2 py-0.5 rounded text-xs">{item.size}</span></p>}
                                                    {item.color && <p className="flex items-center gap-1">{t.products.color}: <span className="font-medium text-black px-2 py-0.5 rounded text-xs border border-gray-200">{item.color}</span></p>}
                                                    <p className="sm:hidden font-bold text-black mt-2">{item.price.toLocaleString()} {t.common.egp}</p>
                                                </div>
                                            </div>

                                            <div className="flex justify-between items-end mt-4">
                                                <div className="flex items-center gap-2 border border-gray-200 rounded-full p-1 bg-gray-50">
                                                    <button
                                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-gray-100 transition-colors disabled:opacity-50"
                                                        onClick={() => addToCart({ ...item, qty: Math.max(1, item.qty - 1) })}
                                                        disabled={item.qty <= 1}
                                                    >
                                                        <Minus className="h-3 w-3" />
                                                    </button>
                                                    <span className="text-sm font-semibold w-6 text-center tabular-nums">{item.qty}</span>
                                                    <button
                                                        className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm hover:bg-black hover:text-white transition-colors disabled:opacity-50"
                                                        onClick={() => addToCart({ ...item, qty: Math.min(item.countInStock, item.qty + 1) })}
                                                        disabled={item.qty >= item.countInStock}
                                                    >
                                                        <Plus className="h-3 w-3" />
                                                    </button>
                                                </div>

                                                <button
                                                    className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-full"
                                                    onClick={() => removeFromCart(item.product)}
                                                    title={t.cart.remove}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm sticky top-24">
                                <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                                    <ShoppingBag className="w-5 h-5 text-gray-400" />
                                    {t.cart.orderSummary}
                                </h2>

                                <div className="space-y-3 text-sm mb-6">
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t.cart.subtotal}</span>
                                        <span className="font-medium">{total.toLocaleString()} {t.common.egp}</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t.cart.shipping}</span>
                                        {total >= freeShippingThreshold ? (
                                            <span className="font-bold text-green-600">{language === 'ar' ? 'مجاني' : 'Free'}</span>
                                        ) : (
                                            <span className="text-gray-500 italic">{t.cart.calculatedAtCheckout}</span>
                                        )}
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-gray-600">{t.cart.tax}</span>
                                        <span className="text-gray-500 italic">{t.cart.calculatedAtCheckout}</span>
                                    </div>
                                </div>

                                <Separator className="my-6 bg-gray-100" />

                                <div className="flex justify-between mb-8">
                                    <span className="text-lg font-bold">{t.cart.total}</span>
                                    <div className="text-end">
                                        <span className="text-2xl font-bold block leading-none">{total.toLocaleString()} {t.common.egp}</span>
                                        <span className="text-xs text-gray-500 font-normal mt-1 block">{language === 'ar' ? 'شاملاً الضرائب' : 'Including VAT'}</span>
                                    </div>
                                </div>

                                <Button
                                    onClick={checkoutHandler}
                                    className="w-full h-12 text-base brand-button-accent rounded-full font-bold shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all transform hover:-translate-y-0.5"
                                    size="lg"
                                >
                                    {t.cart.checkout}
                                    {language === 'ar' ? <ArrowRight className="mr-2 h-4 w-4 rotate-180" /> : <ArrowRight className="ml-2 h-4 w-4" />}
                                </Button>

                                {/* <div className="flex justify-center gap-3 mt-6 opacity-40 grayscale">
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Visa_Inc._logo.svg" alt="Visa" className="h-4" />
                                    <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" alt="Mastercard" className="h-4" />
                                </div> */}

                                <p className="text-xs text-center text-gray-400 mt-4 flex items-center justify-center gap-1">
                                    <Shield className="w-3 h-3" />
                                    {t.cart.secureCheckout}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

// Simple visual shield icon for summary
function Shield({ className }: { className?: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
        </svg>
    )
}

export default CartPage;

import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useLanguage } from '@/context/LanguageContext';
import { useAuth } from "@/context/AuthContext";
// import { useToast } from "@/hooks/use-toast";
import api from '../utils/api';
import pageTransition from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Check, Truck, CreditCard, Package } from "lucide-react";
import { cn } from "@/lib/utils";
import PageTransition from '@/components/animations/PageTransition';

const OrderPage = () => {
    const { id } = useParams();
    const { t, language } = useLanguage();
    const { user } = useAuth();

    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrder = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/orders/${id}`);
                setOrder(data);
            } catch (err: any) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchOrder();
        }
    }, [id]);

    const deliverHandler = async () => {
        try {
            await api.put(`/orders/${id}/deliver`);
            setOrder({ ...order, isDelivered: true, deliveredAt: new Date().toISOString(), isPaid: true, paidAt: new Date().toISOString() });
        } catch (err) {
            console.error(err);
        }
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleString(language === 'ar' ? 'ar-EG' : 'en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-black" />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex flex-col items-center justify-center text-red-500">
            <p className="text-lg font-medium mb-4">{error}</p>
            <Button asChild variant="outline"><Link to="/">{t.nav.home}</Link></Button>
        </div>
    );

    if (!order) return <div className="min-h-screen flex items-center justify-center">Order not found</div>;

    // Steps Logic
    const steps = [
        { id: 'placed', label: language === 'ar' ? 'تم الطلب' : 'Order Placed', icon: Package, active: true, completed: true, date: order.createdAt },
        { id: 'paid', label: language === 'ar' ? 'تم الدفع' : 'Payment', icon: CreditCard, active: true, completed: order.isPaid, date: order.paidAt },
        { id: 'delivered', label: language === 'ar' ? 'تم التوصيل' : 'Delivered', icon: Truck, active: true, completed: order.isDelivered, date: order.deliveredAt },
    ];

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50/50 pb-20">
                <div className="brand-container py-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
                                {language === 'ar' ? `طلب رقم ${order._id.substring(0, 8)}` : `Order #${order._id.substring(0, 8).toUpperCase()}`}
                            </h1>
                            <p className="text-gray-500 text-sm">
                                {new Date(order.createdAt).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                        <div className="flex gap-2">
                            {order.isDelivered ? (
                                <span className="bg-green-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                                    <Check className="w-4 h-4" />
                                    {language === 'ar' ? 'مكتمل' : 'Completed'}
                                </span>
                            ) : (
                                <span className="bg-blue-50 text-blue-600 px-4 py-1.5 rounded-full text-sm font-bold flex items-center gap-2">
                                    <Truck className="w-4 h-4" />
                                    {language === 'ar' ? 'قيد التوصيل' : 'In Progress'}
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Stepper */}
                    <div className="bg-white border boundary-gray-100 rounded-xl p-6 md:p-8 mb-8 shadow-sm">
                        <div className="relative flex justify-between">
                            {/* Progress Bar Line */}
                            <div className="absolute top-5 left-0 w-full h-1 bg-gray-100 z-0 hidden md:block">
                                <div
                                    className="h-full bg-green-500 transition-all duration-1000 ease-out"
                                    style={{ width: order.isDelivered ? '100%' : order.isPaid ? '50%' : '0%' }}
                                />
                            </div>

                            {steps.map((step, idx) => {
                                const isCompleted = step.completed;
                                const isCurrent = !step.completed && (idx === 0 || steps[idx - 1].completed);

                                return (
                                    <div key={step.id} className="relative z-10 flex flex-col items-center flex-1">
                                        <div className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 mb-3",
                                            isCompleted ? "bg-green-500 border-green-500 text-white shadow-lg shadow-green-200" :
                                                isCurrent ? "bg-white border-blue-500 text-blue-500 shadow-lg shadow-blue-100" :
                                                    "bg-white border-gray-200 text-gray-300"
                                        )}>
                                            <step.icon className="w-4 h-4" />
                                        </div>
                                        <p className={cn("text-sm font-bold mb-1", isCompleted ? "text-gray-900" : "text-gray-500")}>
                                            {step.label}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {step.date ? formatDate(step.date) : (idx !== 0 ? '-' : '')}
                                        </p>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Left Column: Items & Info */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Order Items */}
                            <div className="bg-white border border-gray-100 rounded-xl overflow-hidden shadow-sm">
                                <div className="p-6 border-b border-gray-100">
                                    <h2 className="text-lg font-bold">{language === 'ar' ? 'المنتجات' : 'Items'}</h2>
                                </div>
                                <div className="divide-y divide-gray-100">
                                    {order.orderItems.map((item: any) => (
                                        <div key={item._id} className="p-6 flex gap-4 hover:bg-gray-50/50 transition-colors">
                                            <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                                                <img
                                                    src={item.image || "/placeholder.jpg"}
                                                    alt={item.name}
                                                    className="h-full w-full object-cover object-center"
                                                />
                                            </div>
                                            <div className="flex flex-1 flex-col justify-between">
                                                <div>
                                                    <div className="flex justify-between">
                                                        <h3 className="text-base font-medium text-gray-900">
                                                            <Link to={`/product/${item.product}`} className="hover:underline">
                                                                {item.name}
                                                            </Link>
                                                        </h3>
                                                        <p className="text-base font-bold text-gray-900">
                                                            {(item.price * item.qty).toLocaleString()} {t.common.egp}
                                                        </p>
                                                    </div>
                                                    {/* Optional: Add size/color if available in item object */}
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {language === 'ar' ? 'الكمية' : 'Quantity'}: {item.qty} x {item.price.toLocaleString()} {t.common.egp}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Shipping & Payment Info Grid */}
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm h-full">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <Truck className="w-4 h-4 text-gray-500" />
                                        {t.cart.shipping}
                                    </h3>
                                    <div className="space-y-3 text-sm text-gray-600">
                                        <p><span className="font-medium text-gray-900 block mb-1">{order.user.name}</span></p>
                                        <p>{order.user.email}</p>
                                        <p>{order.user.phone}</p>
                                        <div className="h-px bg-gray-100 w-full my-3" />
                                        <p className="leading-relaxed">
                                            {order.shippingAddress.address}<br />
                                            {order.shippingAddress.city}, {order.shippingAddress.country}<br />
                                            {order.shippingAddress.postalCode}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm h-full">
                                    <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                                        <CreditCard className="w-4 h-4 text-gray-500" />
                                        {language === 'ar' ? 'الدفع' : 'Payment'}
                                    </h3>
                                    <div className="space-y-4">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 mb-1">{language === 'ar' ? 'طريقة الدفع' : 'Payment Method'}</p>
                                            <p className="text-sm text-gray-600">
                                                {order.paymentMethod === 'CashOnDelivery'
                                                    ? (language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery')
                                                    : order.paymentMethod}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-900 mb-1">{language === 'ar' ? 'حالة الدفع' : 'Payment Status'}</p>
                                            {order.isPaid ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    {language === 'ar' ? 'تم الدفع' : 'Paid'}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    {language === 'ar' ? 'معلق' : 'Pending'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Summary */}
                        <div className="lg:col-span-1">
                            <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm sticky top-24">
                                <h2 className="text-lg font-bold mb-6">{t.cart.orderSummary}</h2>
                                <div className="space-y-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">{t.cart.subtotal}</span>
                                        <span className="font-medium">{order.itemsPrice?.toLocaleString()} {t.common.egp}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">{t.cart.shipping}</span>
                                        <span className="font-medium text-green-600">
                                            {order.shippingPrice === 0 ? (language === 'ar' ? 'مجاني' : 'Free') : `${order.shippingPrice} ${t.common.egp}`}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">{t.cart.tax}</span>
                                        <span className="font-medium">{order.taxPrice?.toFixed(2)} {t.common.egp}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-lg font-bold">
                                        <span>{t.cart.total}</span>
                                        <span>{order.totalPrice?.toLocaleString()} {t.common.egp}</span>
                                    </div>

                                    {/* Admin Actions */}
                                    {user && user.isAdmin && (
                                        <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
                                            <p className="text-xs font-bold uppercase tracking-wider text-gray-400 text-center">Admin Controls</p>
                                            {!order.isDelivered && (
                                                <Button
                                                    onClick={deliverHandler}
                                                    className="w-full bg-black text-white hover:bg-gray-800"
                                                >
                                                    {language === 'ar' ? 'تحديد كـ "تم التوصيل"' : 'Mark as Delivered'}
                                                </Button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default OrderPage;

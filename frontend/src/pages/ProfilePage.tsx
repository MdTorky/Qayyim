import React, { useState, useEffect } from "react";
import { Link, Navigate, useSearchParams } from "react-router-dom";
import {
    User as UserIcon,
    Package,
    Heart,
    MapPin,
    LogOut,
    Plus,
    Trash2,
    Pencil,
    ChevronRight,
    Loader2,
    Settings,
    Shield
} from "lucide-react";
import api from "../utils/api";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import PageTransition from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ProductCard from "@/components/products/ProductCard";
import { getGovernorateOptions } from "@/config/shippingRates";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Order {
    _id: string;
    createdAt: string;
    totalPrice: number;
    isPaid: boolean;
    isDelivered: boolean;
    orderStatus: string;
    paymentMethod: string;
    orderItems: any[];
}

const ProfilePage: React.FC = () => {
    const { t, language } = useLanguage();
    const { toast } = useToast();
    const { user, login, logout, loading } = useAuth();
    const { clearCart } = useCart();
    const { clearWishlist, items: wishlistItems } = useWishlist();
    const isAuthenticated = !!user;

    const [searchParams, setSearchParams] = useSearchParams();
    const activeTab = searchParams.get('tab') || 'profile';

    // ... (rest of state)

    // ... (rest of hooks)

    // ...



    // Address State
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [newAddress, setNewAddress] = useState({
        address: '',
        city: '',
        postalCode: '',
        country: 'Egypt',
        isDefault: false
    });
    const [editAddressId, setEditAddressId] = useState<string | null>(null);
    const [loadingAddress, setLoadingAddress] = useState(false);

    // Profile Edit State
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        phone: ''
    });
    const [loadingProfile, setLoadingProfile] = useState(false);

    // Orders State
    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(false);

    // Initialize Profile Data
    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                password: '',
                confirmPassword: '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    // Fetch Orders
    useEffect(() => {
        if (activeTab === 'orders') {
            const fetchOrders = async () => {
                setLoadingOrders(true);
                try {
                    const { data } = await api.get('/orders/myorders');
                    setOrders(data);
                } catch (error) {
                    console.error("Error fetching orders:", error);
                    toast({
                        variant: "destructive",
                        title: language === "ar" ? "خطأ" : "Error",
                        description: language === "ar" ? "فشل تحميل الطلبات" : "Failed to load orders"
                    });
                } finally {
                    setLoadingOrders(false);
                }
            };
            fetchOrders();
        }
    }, [activeTab, language]);


    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (profileData.password && profileData.password !== profileData.confirmPassword) {
            toast({
                variant: "destructive",
                title: t.common.error,
                description: language === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match",
            });
            return;
        }

        setLoadingProfile(true);
        try {
            const { data } = await api.put('/users/profile', {
                name: profileData.name,
                email: profileData.email,
                password: profileData.password,
                phone: profileData.phone
            });

            login({ ...data, token: user?.token || data.token });
            toast({
                title: t.common.success,
                description: language === "ar" ? "تم تحديث الملف الشخصي" : "Profile updated successfully",
            });
            // Clear password fields on success
            setProfileData(prev => ({ ...prev, password: '', confirmPassword: '' }));
        } catch (error) {
            console.error("Error updating profile:", error);
            toast({
                variant: "destructive",
                title: language === "ar" ? "خطأ" : "Error",
                description: language === "ar" ? "فشل تحديث الملف الشخصي" : "Failed to update profile"
            });
        } finally {
            setLoadingProfile(false);
        }
    };

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoadingAddress(true);
        try {
            const payload = { ...newAddress };
            if (editAddressId) {
                await api.put(`/users/profile/address/${editAddressId}`, payload);
                toast({
                    title: language === "ar" ? "تم بنجاح" : "Success",
                    description: language === "ar" ? "تم تحديث العنوان بنجاح" : "Address updated successfully"
                });
            } else {
                await api.post('/users/profile/address', payload);
                toast({
                    title: language === "ar" ? "تم بنجاح" : "Success",
                    description: language === "ar" ? "تم إضافة العنوان بنجاح" : "Address added successfully"
                });
            }

            setShowAddressForm(false);
            setEditAddressId(null);
            setNewAddress({ address: '', city: '', postalCode: '', country: 'Egypt', isDefault: false });

            // Refresh user profile to get updated addresses
            const { data } = await api.get('/users/profile');
            login({ ...data, token: user?.token });

        } catch (error) {
            toast({
                variant: "destructive",
                title: language === "ar" ? "خطأ" : "Error",
                description: language === "ar" ? "فشل حفظ العنوان" : "Failed to save address"
            });
        } finally {
            setLoadingAddress(false);
        }
    };

    const handleEditAddress = (addr: any) => {
        setNewAddress({
            address: addr.address,
            city: addr.city,
            postalCode: addr.postalCode,
            country: addr.country,
            isDefault: addr.isDefault
        });
        setEditAddressId(addr._id);
        setShowAddressForm(true);
    };

    const handleRemoveAddress = async (id: string) => {
        if (!window.confirm(language === 'ar' ? 'هل أنت متأكد من حذف هذا العنوان؟' : 'Are you sure you want to delete this address?')) return;
        try {
            await api.delete(`/users/profile/address/${id}`);
            const { data } = await api.get('/users/profile');
            login({ ...data, token: user?.token });
            toast({
                title: language === "ar" ? "تم بنجاح" : "Success",
                description: language === "ar" ? "تم حذف العنوان" : "Address deleted"
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: language === "ar" ? "خطأ" : "Error",
                description: language === "ar" ? "فشل حذف العنوان" : "Failed to delete address"
            });
        }
    };

    const tabs = [
        { id: 'profile', label: t.account.profile, icon: UserIcon },
        { id: 'orders', label: t.account.orders, icon: Package },
        { id: 'wishlist', label: t.account.wishlist, icon: Heart },
        { id: 'addresses', label: t.account.addresses, icon: MapPin },
    ];

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-300" />
        </div>
    );

    if (!isAuthenticated) return <Navigate to="/login" replace />;

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50/50 pb-20">
                <div className="bg-white border-b border-gray-100">
                    <div className="brand-container py-4 md:py-8">
                        <div className="flex items-center gap-4">
                            <div className="h-16 w-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
                                {user?.name?.charAt(0).toUpperCase()}
                                {user?.name?.split(" ")[1].charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold tracking-tight">{user?.name}</h1>
                                <p className="text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="brand-container pt-4 md:pt-8">
                    <div className="grid lg:grid-cols-4 gap-6 lg:gap-8">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-1">
                            {/* Desktop Sidebar */}
                            <div className="hidden lg:block bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden sticky top-24">
                                <nav className="p-2 space-y-1">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => setSearchParams({ tab: tab.id })}
                                            className={cn(
                                                "w-full flex items-center justify-between px-4 py-3 rounded-lg text-sm font-medium transition-all",
                                                activeTab === tab.id
                                                    ? "bg-black text-white shadow-md"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-black"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <tab.icon className="h-4 w-4" />
                                                {tab.label}
                                            </div>
                                            {activeTab === tab.id && <ChevronRight className="h-4 w-4" />}
                                        </button>
                                    ))}
                                    <div className="pt-2 mt-2 border-t border-gray-100">
                                        <button
                                            onClick={() => {
                                                clearCart();
                                                clearWishlist();
                                                logout();
                                            }}
                                            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                                        >
                                            <LogOut className="h-4 w-4" />
                                            {t.nav.logout}
                                        </button>
                                    </div>
                                </nav>
                            </div>

                            {/* Mobile Horizontal Nav */}
                            <div className="lg:hidden sticky top-[72px] z-30 bg-gray-50/95 backdrop-blur-sm -mx-4 px-4 py-3 mb-6 border-b border-gray-200/50">
                                <div className="flex flex-wrap justify-center gap-3 ">
                                    {tabs.map(tab => (
                                        <button
                                            key={tab.id}
                                            onClick={() => {
                                                setSearchParams({ tab: tab.id });
                                                // Optional: scroll to top or content
                                                window.scrollTo({ top: 0, behavior: 'smooth' });
                                            }}
                                            className={cn(
                                                "snap-start flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold whitespace-nowrap transition-all shadow-sm",
                                                activeTab === tab.id
                                                    ? "bg-black text-white shadow-md ring-2 ring-black ring-offset-1"
                                                    : "bg-white text-gray-600 border border-gray-100 hover:border-gray-300"
                                            )}
                                        >
                                            <tab.icon className="h-4 w-4" />
                                            {tab.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Main Content Area */}
                        <div className="lg:col-span-3">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 md:p-8">
                                        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
                                            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
                                                <Settings className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <h2 className="text-lg font-bold">{t.account.profile}</h2>
                                                <p className="text-sm text-gray-500">{language === 'ar' ? "إدارة معلوماتك الشخصية" : "Manage your personal information"}</p>
                                            </div>
                                        </div>
                                        <form onSubmit={handleUpdateProfile} className="space-y-5 max-w-2xl">
                                            <div className="grid md:grid-cols-2 gap-5">
                                                <div>
                                                    <label className="text-sm font-medium mb-1.5 block text-gray-700">{t.checkout.name}</label>
                                                    <input
                                                        type="text"
                                                        value={profileData.name}
                                                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                                                        className="brand-input w-full"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-medium mb-1.5 block text-gray-700">{language === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                                                    <input
                                                        type="tel"
                                                        value={profileData.phone}
                                                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                                                        className="brand-input w-full"
                                                        placeholder="01xxxxxxxxx"
                                                    />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="text-sm font-medium mb-1.5 block text-gray-700">{t.auth.email}</label>
                                                    <input
                                                        type="email"
                                                        value={profileData.email}
                                                        disabled
                                                        className="brand-input w-full bg-gray-50 text-gray-500 cursor-not-allowed border-dashed"
                                                    />
                                                </div>
                                            </div>

                                            <div className="pt-6 mt-6 border-t border-gray-100">
                                                <h3 className="text-base font-semibold mb-4 flex items-center gap-2">
                                                    <Shield className="h-4 w-4 text-green-600" />
                                                    {language === 'ar' ? "الأمان" : "Security"}
                                                </h3>
                                                <div className="grid md:grid-cols-2 gap-5">
                                                    <div>
                                                        <label className="text-sm font-medium mb-1.5 block text-gray-700">{t.auth.password}</label>
                                                        <input
                                                            type="password"
                                                            value={profileData.password}
                                                            onChange={(e) => setProfileData({ ...profileData, password: e.target.value })}
                                                            className="brand-input w-full"
                                                            placeholder="••••••••"
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1.5 block text-gray-700">{t.auth.confirmPassword}</label>
                                                        <input
                                                            type="password"
                                                            value={profileData.confirmPassword}
                                                            onChange={(e) => setProfileData({ ...profileData, confirmPassword: e.target.value })}
                                                            className="brand-input w-full"
                                                            placeholder="••••••••"
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 flex justify-end">
                                                <Button type="submit" disabled={loadingProfile} className="brand-button-accent min-w-[140px]">
                                                    {loadingProfile && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                    {t.common.save}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Orders Tab */}
                            {activeTab === 'orders' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold tracking-tight">{t.account.orders}</h2>
                                        <span className="text-sm text-gray-500">{orders.length} {language === 'ar' ? "طلبات" : "orders"}</span>
                                    </div>

                                    {loadingOrders ? (
                                        <div className="py-20 flex justify-center text-gray-400">
                                            <Loader2 className="h-8 w-8 animate-spin" />
                                        </div>
                                    ) : orders.length > 0 ? (
                                        <div className="space-y-4">
                                            {orders.map((order) => (
                                                <div key={order._id} className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md transition-shadow group">
                                                    <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-4">
                                                        <div>
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <h3 className="font-bold text-gray-900">#{order._id.substring(0, 8).toUpperCase()}</h3>
                                                                <span className="text-xs text-gray-400">•</span>
                                                                <p className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                                                            </div>
                                                            <div className="flex items-center gap-2 mt-2">
                                                                <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                                                                    order.isPaid ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700")}>
                                                                    {order.isPaid ? (language === 'ar' ? 'تم الدفع' : 'Paid') : (language === 'ar' ? 'غير مدفوع' : 'Unpaid')}
                                                                </span>
                                                                <span className={cn("px-2.5 py-1 rounded-full text-xs font-semibold uppercase tracking-wider",
                                                                    order.isDelivered ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-700")}>
                                                                    {order.isDelivered ? (language === 'ar' ? 'تم التوصيل' : 'Delivered') : (language === 'ar' ? 'قيد المعالجة' : 'Processing')}
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div className="text-end">
                                                            <p className="text-sm text-gray-500 mb-1">{language === 'ar' ? "المجموع" : "Total Amount"}</p>
                                                            <p className="text-xl font-bold text-gray-900">{order.totalPrice.toLocaleString()} {t.common.egp}</p>
                                                        </div>
                                                    </div>
                                                    <div className="pt-4 mt-2 border-t border-gray-50 flex items-center justify-between">
                                                        <div className="flex -space-x-2 rtl:space-x-reverse overflow-hidden">
                                                            {/* Preview Images would contain 3 max */}
                                                            {/* Assuming we might have logic here, otherwise just link */}
                                                        </div>
                                                        <Button asChild variant="outline" size="sm" className="group-hover:border-black group-hover:bg-black group-hover:text-white transition-all">
                                                            <Link to={`/order/${order._id}`}>
                                                                {language === 'ar' ? 'التفاصيل' : 'Order Details'}
                                                            </Link>
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-xl">
                                            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">{language === 'ar' ? "لا توجد طلبات" : "No orders yet"}</h3>
                                            <p className="text-gray-500 mb-6">{language === 'ar' ? "لم تقم بأي طلب حتى الآن" : "You haven't placed any orders yet."}</p>
                                            <Button asChild className="brand-button-accent">
                                                <Link to="/products">{t.cart.continueShopping}</Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Wishlist Tab */}
                            {activeTab === 'wishlist' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold tracking-tight">{t.account.wishlist}</h2>
                                        <span className="text-sm text-gray-500">{wishlistItems.length} {language === 'ar' ? "عناصر" : "items"}</span>
                                    </div>
                                    {wishlistItems.length > 0 ? (
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                            {wishlistItems.map(product => (
                                                <ProductCard key={product._id} product={product} />
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-white border border-dashed border-gray-200 rounded-xl">
                                            <Heart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-1">{language === 'ar' ? "المفضلة فارغة" : "Your wishlist is empty"}</h3>
                                            <p className="text-gray-500 mb-6">{language === 'ar' ? "احفظ العناصر للرجوع إليها لاحقًا" : "Save items you love to revisit later."}</p>
                                            <Button asChild className="brand-button-accent">
                                                <Link to="/products">{t.cart.continueShopping}</Link>
                                            </Button>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Addresses Tab */}
                            {activeTab === 'addresses' && (
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <h2 className="text-2xl font-bold tracking-tight">{t.account.addresses}</h2>
                                        <Button onClick={() => {
                                            setEditAddressId(null);
                                            setNewAddress({ address: '', city: '', postalCode: '', country: 'Egypt', isDefault: false });
                                            setShowAddressForm(true);
                                        }}>
                                            <Plus className="h-4 w-4 me-2" />
                                            {language === 'ar' ? 'إضافة عنوان' : 'Add New'}
                                        </Button>
                                    </div>

                                    {showAddressForm && (
                                        <div className="bg-white border border-gray-200 shadow-sm rounded-xl p-6 mb-8 animate-fade-in">
                                            <h3 className="font-bold mb-4">{editAddressId ? (language === 'ar' ? 'تعديل العنوان' : 'Edit Address') : (language === 'ar' ? 'عنوان جديد' : 'New Address')}</h3>

                                            <form onSubmit={handleSaveAddress} className="space-y-4">
                                                <div className="grid md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">{t.checkout.address}</label>
                                                        <input required type="text" value={newAddress.address} onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })} className="brand-input w-full" />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">{t.checkout.city}</label>
                                                        <Select
                                                            value={newAddress.city}
                                                            onValueChange={(val) => setNewAddress({ ...newAddress, city: val })}
                                                            required
                                                        >
                                                            <SelectTrigger className="w-full h-[42px] bg-gray-50 border-gray-200">
                                                                <SelectValue placeholder={language === 'ar' ? 'اختر المحافظة' : 'Select Governorate'} />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {getGovernorateOptions(language as 'en' | 'ar').map((opt) => (
                                                                    <SelectItem key={opt.value} value={opt.value}>
                                                                        {opt.label}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">{t.checkout.postalCode}</label>
                                                        <input required type="text" value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} className="brand-input w-full" />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1 block">{language === 'ar' ? 'الدولة' : 'Country'}</label>
                                                        <input required type="text" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} className="brand-input w-full" />
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2 py-2">
                                                    <input type="checkbox" id="defaultAddr" checked={newAddress.isDefault} onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.checked })} className="rounded border-gray-300 text-black focus:ring-black" />
                                                    <label htmlFor="defaultAddr" className="text-sm text-gray-700">{language === 'ar' ? 'تعيين كافتراضي' : 'Set as default address'}</label>
                                                </div>
                                                <div className="flex justify-end gap-3 pt-2">
                                                    <Button type="button" variant="ghost" onClick={() => setShowAddressForm(false)}>{t.common.cancel}</Button>
                                                    <Button type="submit" disabled={loadingAddress} className="bg-black text-white hover:bg-gray-800">{loadingAddress ? "Saving..." : t.common.save}</Button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    <div className="grid md:grid-cols-2 gap-6">
                                        {user?.addresses && user.addresses.length > 0 ? (
                                            user.addresses.map((addr: any) => (
                                                <div key={addr._id} className={cn("relative p-6 rounded-xl border transition-all hover:shadow-md", addr.isDefault ? "bg-gray-50 border-black ring-1 ring-black/5" : "bg-white border-gray-200")}>
                                                    {addr.isDefault && (
                                                        <span className="absolute top-4 right-4 bg-black text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                                                            {language === 'ar' ? 'افتراضي' : 'Default'}
                                                        </span>
                                                    )}
                                                    <div className="flex items-start gap-4 mb-4">
                                                        <div className="p-3 bg-white border border-gray-100 rounded-full text-gray-500">
                                                            <MapPin className="h-5 w-5" />
                                                        </div>
                                                        <div>
                                                            <p className="font-bold text-gray-900">{addr.address}</p>
                                                            <p className="text-sm text-gray-500">{addr.city}, {addr.postalCode}</p>
                                                            <p className="text-sm text-gray-500">{addr.country}</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2 pt-4 border-t border-gray-100">
                                                        <Button variant="ghost" size="sm" onClick={() => handleEditAddress(addr)} className="text-gray-600 hover:text-black">
                                                            <Pencil className="h-3.5 w-3.5 me-1.5" />
                                                            {language === 'ar' ? 'تعديل' : 'Edit'}
                                                        </Button>
                                                        <Button variant="ghost" size="sm" onClick={() => handleRemoveAddress(addr._id)} className="text-red-500 hover:text-red-600 hover:bg-red-50">
                                                            <Trash2 className="h-3.5 w-3.5 me-1.5" />
                                                            {language === 'ar' ? 'حذف' : 'Delete'}
                                                        </Button>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="md:col-span-2 text-center py-12 bg-white border border-dashed border-gray-200 rounded-xl">
                                                <MapPin className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                                                <p className="text-gray-500">{language === 'ar' ? 'لا توجد عناوين محفوظة' : 'No addresses saved yet'}</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default ProfilePage;

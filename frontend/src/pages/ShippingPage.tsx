import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import { MapPin, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';

const ShippingPage = () => {
    const { shippingAddress, saveShippingAddress } = useCart();
    const { user } = useAuth();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const [address, setAddress] = useState(shippingAddress.address || '');
    const [city, setCity] = useState(shippingAddress.city || '');
    const [postalCode, setPostalCode] = useState(shippingAddress.postalCode || '');
    const [country, setCountry] = useState(shippingAddress.country || 'Egypt');

    // Logic to handle saved addresses selection
    const [selectedSavedAddress, setSelectedSavedAddress] = useState<string>('new');

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        saveShippingAddress({ address, city, postalCode, country });
        navigate('/payment');
    };

    const handleSavedAddressChange = (addrId: string) => {
        setSelectedSavedAddress(addrId);
        if (addrId !== 'new') {
            const addr = user?.addresses?.find((a: any) => a._id === addrId);
            if (addr) {
                setAddress(addr.address);
                setCity(addr.city);
                setPostalCode(addr.postalCode);
                setCountry(addr.country);
            }
        } else {
            setAddress('');
            setCity('');
            setPostalCode('');
            // Country stays Egypt
        }
    };

    // Auto-select Default Address
    useEffect(() => {
        if (user?.addresses && user.addresses.length > 0 && selectedSavedAddress === 'new' && !shippingAddress.address) {
            const defaultAddr = user.addresses.find((a: any) => a.isDefault) || user.addresses[0];
            if (defaultAddr) {
                handleSavedAddressChange(defaultAddr._id);
            }
        } else if (shippingAddress.address && selectedSavedAddress === 'new') {
            // Try to match current shipping address with a saved one to select it visually
            const matchingAddr = user?.addresses?.find((a: any) =>
                a.address === shippingAddress.address &&
                a.city === shippingAddress.city
            );
            if (matchingAddr) {
                setSelectedSavedAddress(matchingAddr._id);
            }
        }
    }, [user, user?.addresses]);


    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50/50 pb-20">
                <div className="brand-container py-12 max-w-3xl">
                    <CheckoutSteps currentStep={2} />

                    <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-10 shadow-sm">
                        <div className="mb-8 text-center sm:text-start">
                            <h1 className="text-2xl font-bold mb-2">{t.checkout.shipping || (language === 'ar' ? 'عنوان الشحن' : 'Shipping Address')}</h1>
                            <p className="text-gray-500 text-sm">
                                {language === 'ar' ? 'أين يجب أن نرسل طلبك؟' : 'Where should we send your order?'}
                            </p>
                        </div>

                        <form onSubmit={submitHandler} className="space-y-8">
                            {user?.addresses && user.addresses.length > 0 && (
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-sm text-gray-900 flex items-center gap-2">
                                        <MapPin className="w-4 h-4" />
                                        {language === 'ar' ? 'العناوين المحفوظة' : 'Saved Addresses'}
                                    </h3>

                                    <RadioGroup value={selectedSavedAddress} onValueChange={handleSavedAddressChange} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {user.addresses.map((addr: any) => (
                                            <div key={addr._id} className="relative">
                                                <RadioGroupItem value={addr._id} id={addr._id} className="peer sr-only" />
                                                <Label
                                                    htmlFor={addr._id}
                                                    className="flex flex-col justify-between h-full p-4 border-2 border-gray-100 rounded-xl cursor-pointer hover:border-gray-300 peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-gray-50 transition-all"
                                                >
                                                    <div className="space-y-1">
                                                        <span className="font-semibold block text-base line-clamp-1">{addr.address}</span>
                                                        <span className="text-sm text-gray-500 block">{addr.city}, {addr.postalCode}</span>
                                                    </div>
                                                    {addr.isDefault && (
                                                        <span className="inline-block mt-3 text-[10px] font-bold uppercase tracking-wider text-gray-400 bg-gray-100 px-2 py-1 rounded w-fit">
                                                            {language === 'ar' ? 'الافتراضي' : 'Default'}
                                                        </span>
                                                    )}
                                                </Label>
                                            </div>
                                        ))}

                                        <div className="relative">
                                            <RadioGroupItem value="new" id="new" className="peer sr-only" />
                                            <Label
                                                htmlFor="new"
                                                className="flex flex-col items-center justify-center gap-2 h-full min-h-[120px] p-4 border-2 border-gray-100 border-dashed rounded-xl cursor-pointer hover:border-gray-300 hover:bg-gray-50 peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-gray-50 transition-all text-gray-400 peer-data-[state=checked]:text-black"
                                            >
                                                <div className="p-2 bg-gray-100 rounded-full peer-data-[state=checked]:bg-white peer-data-[state=checked]:shadow-sm">
                                                    <Plus className="w-5 h-5" />
                                                </div>
                                                <span className="font-medium text-sm">
                                                    {language === 'ar' ? 'عنوان جديد' : 'New Address'}
                                                </span>
                                            </Label>
                                        </div>
                                    </RadioGroup>
                                </div>
                            )}

                            <div className={cn("space-y-5 transition-all duration-300", selectedSavedAddress !== 'new' && "opacity-50 pointer-events-none grayscale")}>
                                {/* Using a fieldset to group helps semantic HTML, but for now div is fine */}
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="address">{t.checkout.address}</Label>
                                        <Input
                                            id="address"
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            required={selectedSavedAddress === 'new'}
                                            placeholder="123 Main St"
                                            className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="city">{t.checkout.city}</Label>
                                            <Input
                                                id="city"
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                required={selectedSavedAddress === 'new'}
                                                placeholder="Cairo"
                                                className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="postalCode">{t.checkout.postalCode}</Label>
                                            <Input
                                                id="postalCode"
                                                value={postalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                                required={selectedSavedAddress === 'new'}
                                                placeholder="11234"
                                                className="h-11 bg-gray-50 border-gray-200 focus:bg-white transition-colors"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="country">{language === 'ar' ? 'الدولة' : 'Country'}</Label>
                                        <Input
                                            id="country"
                                            value={country}
                                            onChange={(e) => setCountry(e.target.value)}
                                            required={selectedSavedAddress === 'new'}
                                            disabled // Fixed to Egypt/Default for now
                                            className="h-11 bg-gray-50 border-gray-200 opacity-70"
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 text-base brand-button-accent rounded-full font-bold shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all transform hover:-translate-y-0.5">
                                {language === 'ar' ? 'الاستمرار للدفع' : 'Continue to Payment'}
                            </Button>
                        </form>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default ShippingPage;

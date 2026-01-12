import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';
import PageTransition from "@/components/animations/PageTransition";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Banknote, CreditCard, ArrowLeft } from "lucide-react";
import CheckoutSteps from '@/components/checkout/CheckoutSteps';
import { cn } from '@/lib/utils';

const PaymentPage = () => {
    const { savePaymentMethod, shippingAddress } = useCart();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    const [paymentMethod, setPaymentMethod] = useState('CashOnDelivery');

    if (!shippingAddress.address) {
        navigate('/shipping');
    }

    const submitHandler = (e: React.FormEvent) => {
        e.preventDefault();
        savePaymentMethod(paymentMethod);
        navigate('/placeorder');
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-gray-50/50 pb-20">
                <div className="brand-container py-12 max-w-3xl">
                    <CheckoutSteps currentStep={3} />

                    <div className="bg-white border border-gray-100 rounded-2xl p-6 sm:p-10 shadow-sm">
                        <div className="mb-8 text-center sm:text-start">
                            <h1 className="text-2xl font-bold mb-2">{t.checkout.payment || (language === 'ar' ? 'طريقة الدفع' : 'Payment Method')}</h1>
                            <p className="text-gray-500 text-sm">
                                {language === 'ar' ? 'كيف تفضل أن تدفع؟' : 'How would you like to pay?'}
                            </p>
                        </div>

                        <form onSubmit={submitHandler} className="space-y-8">
                            <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="relative">
                                    <RadioGroupItem value="CashOnDelivery" id="cod" className="peer sr-only" />
                                    <Label
                                        htmlFor="cod"
                                        className="flex flex-col items-center justify-center text-center gap-4 h-full p-6 border-2 border-gray-100 rounded-2xl cursor-pointer hover:border-gray-300 hover:bg-gray-50 peer-data-[state=checked]:border-black peer-data-[state=checked]:bg-gray-50 transition-all"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-green-600 peer-data-[state=checked]:bg-green-100">
                                            <Banknote className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="block font-bold text-lg">{language === 'ar' ? 'الدفع عند الاستلام' : 'Cash on Delivery'}</span>
                                            <span className="block text-xs text-gray-500">{language === 'ar' ? 'ادفع نقداً عند وصول طلبك' : 'Pay cash when you receive your order'}</span>
                                        </div>
                                    </Label>
                                </div>

                                <div className="relative">
                                    <RadioGroupItem value="Online" id="online" disabled className="peer sr-only" />
                                    <Label
                                        htmlFor="online"
                                        className="flex flex-col items-center justify-center text-center gap-4 h-full p-6 border-2 border-gray-100 rounded-2xl cursor-not-allowed opacity-50 bg-gray-50/50 grayscale"
                                    >
                                        <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                                            <CreditCard className="w-6 h-6" />
                                        </div>
                                        <div className="space-y-1">
                                            <span className="block font-bold text-lg">{language === 'ar' ? 'بطاقة ائتمان' : 'Credit Card'}</span>
                                            <span className="block text-xs text-gray-500">{language === 'ar' ? 'قريباً' : 'Coming Soon'}</span>
                                        </div>
                                    </Label>
                                </div>
                            </RadioGroup>

                            <div className="flex items-center gap-4 pt-4">
                                <Button
                                    type="button"
                                    variant="ghost"
                                    onClick={() => navigate('/shipping')}
                                    className="h-12 px-6 rounded-full hover:bg-gray-100"
                                >
                                    <ArrowLeft className={cn("w-4 h-4", language === 'ar' ? "ml-2" : "mr-2")} />
                                    {t.common.back || "Back"}
                                </Button>
                                <Button type="submit" className="flex-1 h-12 text-base brand-button-accent rounded-full font-bold shadow-lg shadow-black/10 hover:shadow-xl hover:shadow-black/20 transition-all transform hover:-translate-y-0.5">
                                    {language === 'ar' ? 'الاستمرار للمراجعة' : 'Continue to Order Review'}
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default PaymentPage;

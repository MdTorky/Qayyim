import React from 'react';
import { useLanguage } from '@/context/LanguageContext';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckoutStepsProps {
    step1?: boolean;
    step2?: boolean;
    step3?: boolean;
    step4?: boolean;
    currentStep: number;
}

const CheckoutSteps: React.FC<CheckoutStepsProps> = ({ currentStep }) => {
    const { language } = useLanguage();

    const steps = [
        { step: 1, label: language === 'ar' ? 'تسجيل الدخول' : 'Sign In', path: '/login' },
        { step: 2, label: language === 'ar' ? 'الشحن' : 'Shipping', path: '/shipping' },
        { step: 3, label: language === 'ar' ? 'الدفع' : 'Payment', path: '/payment' },
        { step: 4, label: language === 'ar' ? 'المراجعة' : 'Order', path: '/placeorder' },
    ];

    return (
        <div className="w-full max-w-3xl mx-auto mb-8 sm:mb-12">
            <div className="relative flex justify-between items-center">
                {/* Connecting Line */}
                <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gray-100 -z-10 -translate-y-1/2" />
                <div
                    className="absolute top-1/2 left-0 h-0.5 bg-black -z-10 -translate-y-1/2 transition-all duration-500 ease-in-out"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((s) => {
                    const isCompleted = currentStep > s.step;
                    const isCurrent = currentStep === s.step;

                    return (
                        <div key={s.step} className="flex flex-col items-center gap-2 bg-gray-50/50 px-2 sm:px-0">
                            <div
                                className={cn(
                                    "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 z-10",
                                    isCompleted ? "bg-black border-black text-white" :
                                        isCurrent ? "bg-white border-black text-black ring-4 ring-black/5" :
                                            "bg-white border-gray-200 text-gray-300"
                                )}
                            >
                                {isCompleted ? <Check className="w-4 h-4 sm:w-5 sm:h-5" /> : s.step}
                            </div>
                            <span
                                className={cn(
                                    "text-xs sm:text-sm font-medium transition-colors duration-300 absolute mt-10 sm:mt-12 whitespace-nowrap",
                                    isCurrent ? "text-black" :
                                        isCompleted ? "text-black" : "text-gray-300"
                                )}
                            >
                                {s.label}
                            </span>
                        </div>
                    );
                })}
            </div>
            {/* Spacer for absolute positioned labels */}
            <div className="h-8 sm:h-10" />
        </div>
    );
};

export default CheckoutSteps;

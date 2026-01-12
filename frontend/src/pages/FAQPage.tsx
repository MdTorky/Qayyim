import { useLanguage } from '@/context/LanguageContext';
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import PageTransition from '@/components/animations/PageTransition';

const FAQPage = () => {
    const { t } = useLanguage();

    const faqs = [
        {
            category: "shipping",
            items: [
                { q: "shipping_time", a: "shipping_time_ans" },
                { q: "shipping_cost", a: "shipping_cost_ans" },
                { q: "international", a: "international_ans" }
            ]
        },
        {
            category: "returns",
            items: [
                { q: "return_policy", a: "return_policy_ans" },
                { q: "exchange", a: "exchange_ans" },
                { q: "refund_time", a: "refund_time_ans" }
            ]
        },
        {
            category: "products",
            items: [
                { q: "sizing", a: "sizing_ans" },
                { q: "care", a: "care_ans" },
                { q: "authenticity", a: "authenticity_ans" }
            ]
        }
    ];

    return (
        <PageTransition>
            <div className="min-h-screen bg-white">
                {/* Hero Section */}
                <div className="bg-gray-50 py-16 mb-12">
                    <div className="brand-container text-center">
                        <h1 className="text-4xl font-bold tracking-tight mb-4">{t.faq.title}</h1>
                        <p className="text-gray-500 max-w-2xl mx-auto">{t.faq.subtitle}</p>
                    </div>
                </div>

                <div className="brand-container pb-24 max-w-3xl">
                    <div className="space-y-12">
                        {faqs.map((category) => (
                            <div key={category.category}>
                                <h2 className="text-xl font-bold mb-6 capitalize pb-2 border-b border-gray-100">
                                    {t.faq.categories[category.category as keyof typeof t.faq.categories]}
                                </h2>
                                <Accordion type="single" collapsible className="w-full">
                                    {category.items.map((item, index) => (
                                        <AccordionItem key={index} value={`${category.category}-${index}`}>
                                            <AccordionTrigger className="text-left font-medium hover:no-underline hover:text-gray-900 data-[state=open]:text-black">
                                                {t.faq.questions[item.q as keyof typeof t.faq.questions]}
                                            </AccordionTrigger>
                                            <AccordionContent className="text-gray-500 leading-relaxed">
                                                {t.faq.answers[item.a as keyof typeof t.faq.answers]}
                                            </AccordionContent>
                                        </AccordionItem>
                                    ))}
                                </Accordion>
                            </div>
                        ))}
                    </div>

                    {/* Contact Support */}
                    <div className="mt-16 p-8 bg-gray-50 rounded-2xl text-center">
                        <h3 className="text-lg font-bold mb-2">{t.faq.stillHaveQuestions}</h3>
                        <p className="text-gray-500 mb-6">{t.faq.contactText}</p>
                        <a
                            // href="mailto:support@qayyim.com"
                            href="https://www.instagram.com/official_qayyim.eg/"
                            className="inline-flex items-center justify-center h-10 px-8 rounded-full bg-black text-white font-medium hover:bg-gray-900
                                     transition-colors"
                        >
                            {t.faq.contactSupport}
                        </a>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default FAQPage;

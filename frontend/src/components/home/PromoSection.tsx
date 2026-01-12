import React from "react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";

const PromoSection: React.FC = () => {
  const { t, language } = useLanguage();

  return (
    <section className="brand-section">
      <div className="brand-container">
        <div className="relative rounded-3xl overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img
              src="https://images.unsplash.com/photo-1441984904996-e0b6ba687e04?w=1600"
              alt="Promo"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/50" />
          </div>

          {/* Content */}
          <div className="relative px-8 py-16 md:px-16 md:py-24">
            <div className="max-w-xl">
              <span className="inline-block px-4 py-2 bg-accent text-accent-foreground rounded-full text-sm font-medium mb-6">
                {language === "ar" ? "عرض خاص" : "Special Offer"}
              </span>

              <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
                {language === "ar"
                  ? "خصم يصل إلى 30% على المجموعة الجديدة"
                  : "Up to 30% Off New Collection"}
              </h2>

              <p className="text-white/80 text-lg mb-8">
                {language === "ar"
                  ? "تسوق أحدث التصاميم بأسعار مميزة. العرض لفترة محدودة."
                  : "Shop the latest designs at special prices. Limited time offer."}
              </p>

              <Button asChild size="lg" className="brand-button-accent h-14 px-8">
                <Link to="/products">
                  {t.hero.shopNow}
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PromoSection;

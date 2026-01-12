import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const Hero: React.FC = () => {
  const { t, isRTL, language } = useLanguage();

  return (
    <section className="relative min-h-[85vh] flex items-center overflow-hidden bg-black text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="/Clothes/Hero.jpg"
          alt="Hero Background"
          className="w-full h-full object-cover opacity-100"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent" />
      </div>

      <div className="brand-container relative z-10 w-full pt-20">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <span className="inline-block px-4 py-1.5 border border-white/20 backdrop-blur-md rounded-full text-[10px] md:text-xs font-medium mb-6 text-gray-200">
              {/* {language === "ar" ? "تشكيلة الموسم الجديد" : "New Season Collection"} */}
              {language === "ar" ? "كلمات حرّكت أمة تُحمل اليوم على ظهرك" : "Words that once moved nations — now carried on your back."}
            </span>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6  tracking-tight">
              {language === "ar" ? (
                <>
                  <span className="text-gray-400">  ارتقِ</span> بأناقتك.
                </>
              ) : (
                <>
                  ELEVATE <br />
                  <span className="text-gray-400">YOUR STYLE.</span>
                </>
              )}
            </h1>

            <p className="text-lg md:text-2xl text-gray-300 mb-8 max-w-xl leading-relaxed">
              {language === "ar"
                ? "ارتدِ ما تؤمن به\nليست مجرد ملابس — بل رسالة"
                : "Inspired by history. Designed for today."}
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-base bg-white text-black hover:bg-gray-200 transition-all rounded-full cursor-pointer hover:scale-105 active:scale-95  transition duration-300">
                <Link to="/products">
                  {t.hero.shopNow}
                  <ArrowRight className={`ms-2 h-5 w-5 ${isRTL ? "rotate-180" : ""}`} />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 text-base bg-white/10 border-white/30 text-white hover:bg-white/10 hover:text-white backdrop-blur-sm rounded-full cursor-pointer transition duration-300 hover:scale-105 active:scale-95"
              >
                <Link to="/products?category=Hoodies">
                  {language === "ar" ? "تصفح الهوديز" : "Explore Hoodies"}
                </Link>
              </Button>
            </div>

            {/* Social Proof / Stats */}
            <div className="mt-12 flex items-center gap-8 text-sm text-gray-400">
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-lg">20+</span>
                <span>{t.admin.totalProducts}</span>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div className="flex items-center gap-2">
                <span className="text-white font-bold text-lg">1k+</span>
                <span>{t.admin.totalOrders}</span>
              </div>
            </div>

          </motion.div>
        </div>
      </div>

      {/* Scroll indicator - Optional */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/50 animate-bounce hidden md:block"
      >
        <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-1">
          <div className="w-1 h-3 bg-current rounded-full" />
        </div>
      </motion.div>
    </section>
  );
};

export default Hero;

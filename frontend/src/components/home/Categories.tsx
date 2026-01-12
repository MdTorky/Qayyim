import React from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const Categories: React.FC = () => {
  const { t, language } = useLanguage();

  const categories = [
    {
      title: t.nav.men,
      subtitle: language === "ar" ? "أزياء عصرية للرجال" : "Modern Men's Fashion",
      image: "/Clothes/Men C.jpg",
      link: "/products?gender=Men",
      size: "large", // spans 2 cols on desktop if we had a complex grid, or just large row
    },
    {
      title: t.nav.women,
      subtitle: language === "ar" ? "أناقة بلا حدود" : "Timeless Elegance",
      image: "/Clothes/Women C.jpg",
      link: "/products?gender=Women",
      size: "large",
    },
    {
      title: t.products.hoodies,
      subtitle: language === "ar" ? "راحة وأسلوب" : "Comfort & Style",
      image: "/Clothes/Hoodies C.jpg",
      link: "/products?category=Hoodies",
      size: "small",
    },
    {
      title: t.products.pants,
      subtitle: language === "ar" ? "لكل المناسبات" : "For Every Occasion",
      image: "/Clothes/Pants C.jpg",
      link: "/products?category=Pants",
      size: "small",
    },
  ];

  return (
    <section className="brand-section bg-white">
      <div className="brand-container">
        <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              {language === "ar" ? "الفئات المميزة" : "Curated Collections"}
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl">
              {language === "ar"
                ? "استكشف أحدث الصيحات والتصاميم التي اخترناها بعناية لتناسب ذوقك الرفيع."
                : "Explore our carefully selected categories designed to elevate your everyday wardrobe."}
            </p>
          </div>
          <Link to="/products" className="hidden md:flex items-center gap-2 text-sm font-bold border-b-2 border-black pb-1 hover:text-gray-600 hover:border-gray-600 transition-colors">
            {language === "ar" ? "عرض جميع المنتجات" : "VIEW ALL PRODUCTS"}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {categories.map((category, index) => (
            <Link
              key={index}
              to={category.link}
              className={`group relative overflow-hidden rounded-2xl shadow-sm ${index < 2 ? "lg:col-span-6 aspect-[4/3]" : "lg:col-span-6 lg:row-span-1 aspect-[16/9] lg:aspect-[21/9]"
                }`}
            >
              <img
                src={category.image}
                alt={category.title}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors duration-300" />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                  <p className="text-white/80 text-sm font-medium mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 uppercase tracking-wider">
                    {category.subtitle}
                  </p>
                  <div className="flex items-center justify-between">
                    <h3 className="text-3xl font-bold text-white">{category.title}</h3>
                    <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <ArrowUpRight className="text-white w-5 h-5" />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-8 text-center md:hidden">
          <Link to="/products" className="inline-flex items-center gap-2 text-sm font-bold border-b-2 border-black pb-1">
            {language === "ar" ? "عرض جميع المنتجات" : "VIEW ALL PRODUCTS"}
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Categories;

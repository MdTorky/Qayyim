import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "@/context/WishlistContext";
import { useLanguage } from "@/context/LanguageContext";
import ProductCard from "@/components/products/ProductCard";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

const WishlistPage: React.FC = () => {
    const { items } = useWishlist();
    const { t, language } = useLanguage();
    const navigate = useNavigate();

    return (
        <div className="brand-section">
            <div className="brand-container">
                <div className="flex items-center gap-4 mb-8">
                    <Button variant="ghost" onClick={() => navigate(-1)} className="gap-2">
                        {language === "en" ? <ArrowLeft className="h-4 w-4" /> : <ArrowRight className="h-4 w-4" />}
                        {t.common.back}
                    </Button>
                    <h1 className="text-3xl font-bold">{t.account.wishlist}</h1>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-secondary/20 rounded-lg">
                        <p className="text-xl text-muted-foreground mb-6">
                            {language === "ar" ? "قائمة الأمنيات فارغة" : "Your wishlist is empty"}
                        </p>
                        <Button asChild className="brand-button-primary">
                            <Link to="/products">{t.nav.shop}</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {items.map((product) => (
                            <ProductCard key={product._id || product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default WishlistPage;

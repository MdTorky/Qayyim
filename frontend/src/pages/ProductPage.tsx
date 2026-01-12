import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Heart, ShoppingBag, Minus, Plus, ChevronLeft, ChevronRight, Check } from "lucide-react";
// import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/products/ProductGrid";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import api from '../utils/api';
import { useToast } from "@/hooks/use-toast";
import { getColorDetails } from "@/utils/colorMapping";
import PageTransition from "@/components/animations/PageTransition";
import { Skeleton } from "@/components/ui/skeleton";

interface Product {
    _id: string;
    name: string;
    nameAr?: string;
    image: string[] | string;
    description: string;
    descriptionAr?: string;
    price: number;
    originalPrice?: number;
    countInStock?: number;
    quantity?: number; // fallback
    sizes?: string[];
    colors?: string[];
    category: string;
    newArrival?: boolean;
    gender?: string;
}

const ProductPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { t, language, isRTL } = useLanguage();
    const { toast } = useToast();
    const { addToCart } = useCart();
    const { isInWishlist, toggleItem } = useWishlist();

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedProducts, setRelatedProducts] = useState<any[]>([]);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
                // Reset selections when product changes
                setSelectedSize("");
                setSelectedColor("");
                setQuantity(1);
                setCurrentImageIndex(0);

                // Fetch related products
                if (data.category) {
                    const relatedRes = await api.get('/products');
                    if (Array.isArray(relatedRes.data)) {
                        const related = relatedRes.data
                            .filter((p: any) => p._id !== data._id && p.category === data.category)
                            .slice(0, 4);
                        setRelatedProducts(related);
                    }
                }

            } catch (error) {
                console.error('Error fetching product:', error);
                setProduct(null);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);


    if (loading) return (
        <div className="min-h-screen bg-white">
            <div className="brand-container py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    <Skeleton className="aspect-square w-full rounded-xl" />
                    <div className="space-y-6">
                        <Skeleton className="h-10 w-3/4" />
                        <Skeleton className="h-6 w-1/4" />
                        <Skeleton className="h-32 w-full" />
                    </div>
                </div>
            </div>
        </div>
    );

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center py-20 px-4 text-center">
                <h1 className="text-3xl font-bold mb-4">
                    {language === "ar" ? "المنتج غير موجود" : "Product Not Found"}
                </h1>
                <p className="text-muted-foreground mb-8">
                    {language === "ar" ? "ربما تم حذف هذا المنتج أو الرابط غير صحيح." : "This product might have been removed or the link is incorrect."}
                </p>
                <Button asChild className="brand-button-accent h-12 px-8">
                    <Link to="/products">{t.cart.continueShopping}</Link>
                </Button>
            </div>
        );
    }

    const name = language === "ar" && product.nameAr ? product.nameAr : product.name;
    const description = language === "ar" && product.descriptionAr ? product.descriptionAr : product.description;
    const inWishlist = isInWishlist(product._id);
    const stock = product.countInStock !== undefined ? product.countInStock : (product.quantity || 0);

    // Normalize Images
    let displayImages: string[] = [];
    if (Array.isArray(product.image)) {
        displayImages = product.image;
    } else if (typeof product.image === "string") {
        displayImages = [product.image];
    }
    // Fallback
    if (displayImages.length === 0) displayImages = ["/placeholder.jpg"];

    const colorOptions = (product.colors || []).map((c: any) => {
        const colorName = typeof c === 'string' ? c : c.name;
        return getColorDetails(colorName);
    });

    const handleAddToCart = () => {
        if ((product.sizes?.length ?? 0) > 0 && !selectedSize) {
            toast({
                variant: "destructive",
                title: language === "ar" ? "مطلوب" : "Required",
                description: language === "ar" ? "يرجى اختيار المقاس" : "Please select a size"
            });
            return;
        }
        if ((product.colors?.length ?? 0) > 0 && !selectedColor) {
            toast({
                variant: "destructive",
                title: language === "ar" ? "مطلوب" : "Required",
                description: language === "ar" ? "يرجى اختيار اللون" : "Please select a color"
            });
            return;
        }

        addToCart({
            product: product._id,
            name: product.name,
            image: displayImages[0],
            price: product.price,
            countInStock: stock,
            qty: quantity,
            size: selectedSize,
            color: selectedColor
        });
        toast({
            title: language === "ar" ? "تمت الإضافة" : "Added to Cart",
            description: `${name} - ${language === "ar" ? "في عربة التسوق" : "in your cart"}`
        })
    };

    return (
        <PageTransition>
            <div className="min-h-screen bg-white pb-20">
                <div className="brand-container pt-6 pb-12">
                    {/* Breadcrumb - Subtle */}
                    <nav className="text-xs font-medium text-gray-500 mb-6 uppercase tracking-wider">
                        <Link to="/" className="hover:text-black transition-colors">{t.nav.home}</Link>
                        <span className="mx-2">/</span>
                        <Link to="/products" className="hover:text-black transition-colors">{t.nav.shop}</Link>
                        <span className="mx-2">/</span>
                        <span className="text-black">{name}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                        {/* Gallery Section - 7/12 cols */}
                        <div className="lg:col-span-7">
                            {/* Desktop Gallery - Main + Thumbnails */}
                            <div className="hidden lg:flex gap-4 sticky top-32">
                                {/* Thumbnails Column */}
                                <div className="hidden lg:flex flex-col gap-4 w-24 flex-shrink-0">
                                    {displayImages.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "aspect-[3/4] bg-gray-50 cursor-pointer overflow-hidden rounded-md border text-center transition-all",
                                                currentImageIndex === idx
                                                    ? "ring-2 ring-black ring-offset-1 opacity-100"
                                                    : "border-transparent opacity-60 hover:opacity-100 hover:border-gray-200"
                                            )}
                                            onClick={() => setCurrentImageIndex(idx)}
                                            onMouseEnter={() => setCurrentImageIndex(idx)}
                                        >
                                            <img
                                                src={img}
                                                alt={`Thumbnail ${idx}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    ))}
                                </div>

                                {/* Main Image Area */}
                                <div className="flex-1 aspect-[3/4] bg-gray-50 overflow-hidden rounded-lg cursor-zoom-in group relative">
                                    <img
                                        src={displayImages[currentImageIndex]}
                                        alt={name}
                                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                    {/* Optional: Zoom hints or overlays can go here */}
                                </div>
                            </div>

                            {/* Mobile Swipe Layout */}
                            <div className="lg:hidden relative aspect-[3/4] bg-gray-50 overflow-hidden mb-4">
                                <img
                                    src={displayImages[currentImageIndex]}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                />
                                {displayImages.length > 1 && (
                                    <div className="absolute inset-0 flex items-center justify-between p-4 pointer-events-none">
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={() => setCurrentImageIndex(prev => prev === 0 ? displayImages.length - 1 : prev - 1)}
                                            className="pointer-events-auto h-10 w-10 opacity-70 hover:opacity-100 rounded-full shadow-lg"
                                        >
                                            <ChevronLeft className={cn("h-5 w-5", isRTL && "rotate-180")} />
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            onClick={() => setCurrentImageIndex(prev => prev === displayImages.length - 1 ? 0 : prev + 1)}
                                            className="pointer-events-auto h-10 w-10 opacity-70 hover:opacity-100 rounded-full shadow-lg"
                                        >
                                            <ChevronRight className={cn("h-5 w-5", isRTL && "rotate-180")} />
                                        </Button>
                                    </div>
                                )}
                                {/* Mobile Dots */}
                                <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                                    {displayImages.map((_, idx) => (
                                        <div
                                            key={idx}
                                            className={cn(
                                                "w-2 h-2 rounded-full transition-all",
                                                idx === currentImageIndex ? "bg-white w-4" : "bg-white/50"
                                            )}
                                        />
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Product Info - Sticky Column - 5/12 cols */}
                        <div className="lg:col-span-5 relative">
                            <div className="sticky top-32 space-y-8">
                                {/* Header */}
                                <div>
                                    <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2 text-gray-900">{name}</h1>
                                    <div className="flex items-center gap-4">
                                        <p className="text-2xl font-semibold text-gray-900">
                                            {product.price.toLocaleString()} {t.common.egp}
                                        </p>
                                        {product.originalPrice && product.originalPrice > product.price && (
                                            <div className="flex items-center gap-2">
                                                <span className="text-lg text-gray-400 line-through">
                                                    {product.originalPrice.toLocaleString()} {t.common.egp}
                                                </span>
                                                <span className="text-sm font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded">
                                                    -{Math.round((1 - product.price / product.originalPrice) * 100)}%
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-gray-100 w-full" />

                                {/* Colors */}
                                {product.colors && product.colors.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">{t.products.colors}</h3>
                                            {selectedColor && (
                                                <span className="text-xs text-gray-500 font-medium ">
                                                    {language === "ar"
                                                        ? colorOptions.find((c: any) => c.name === selectedColor)?.nameAr || selectedColor
                                                        : selectedColor}
                                                </span>
                                            )}
                                        </div>
                                        <div className="flex gap-3">
                                            {colorOptions.map((color: any) => (
                                                <button
                                                    key={color.name}
                                                    onClick={() => setSelectedColor(color.name)}
                                                    className={cn(
                                                        "w-10 h-10 rounded-full flex items-center justify-center transition-all relative outline-none",
                                                        selectedColor === color.name
                                                            ? "ring-2 ring-black ring-offset-2 scale-110"
                                                            : "ring-1 ring-gray-500 hover:ring-black hover:scale-105"
                                                    )}
                                                    style={{ backgroundColor: color.hex }}
                                                    title={language === "ar" ? color.nameAr : color.name}
                                                >
                                                    {color.hex === "#ffffff" && <span className="absolute inset-0 rounded-full border border-gray-200" />}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sizes */}
                                {product.sizes && product.sizes.length > 0 && (
                                    <div>
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-900">{t.products.sizes}</h3>
                                            {/* <button className="text-xs text-gray-500 underline hover:text-black">
                                                {language === "ar" ? "دليل المقاسات" : "Size Guide"}
                                            </button> */}
                                        </div>
                                        <div className="grid grid-cols-4 gap-2">
                                            {product.sizes.map((size) => (
                                                <button
                                                    key={size}
                                                    onClick={() => setSelectedSize(size)}
                                                    className={cn(
                                                        "h-11 border rounded-md text-sm font-medium transition-all hover:border-gray-900",
                                                        selectedSize === size
                                                            ? "bg-black text-white border-black shadow-md"
                                                            : "bg-white text-gray-700 border-gray-200"
                                                    )}
                                                >
                                                    {size}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Actions */}
                                <div className="space-y-4 pt-4">
                                    <div className="flex gap-4">
                                        {/* Qty */}
                                        <div className="h-14 w-32 flex items-center justify-between border border-gray-200 rounded-lg px-2">
                                            <button
                                                className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30"
                                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                                disabled={quantity <= 1}
                                            >
                                                <Minus className="w-4 h-4" />
                                            </button>
                                            <span className="font-semibold">{quantity}</span>
                                            <button
                                                className="w-8 h-full flex items-center justify-center text-gray-500 hover:text-black disabled:opacity-30"
                                                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                                                disabled={stock > 0 && quantity >= stock}
                                            >
                                                <Plus className="w-4 h-4" />
                                            </button>
                                        </div>

                                        <Button
                                            size="lg"
                                            className="flex-1 h-14 text-base brand-button-accent shadow-lg"
                                            onClick={handleAddToCart}
                                            disabled={stock === 0}
                                        >
                                            <ShoppingBag className="h-5 w-5 me-2" />
                                            {stock === 0 ? t.products.outOfStock : t.products.addToCart}
                                        </Button>

                                        <Button
                                            size="icon"
                                            variant="outline"
                                            className={cn(
                                                "h-14 w-14 border-gray-200 text-gray-500 hover:text-red-500 hover:border-red-200 hover:bg-red-50 transition-colors",
                                                inWishlist && "text-red-500 border-red-200 bg-red-50"
                                            )}
                                            onClick={() => toggleItem({ ...product, id: product._id } as any)}
                                        >
                                            <Heart className={cn("h-6 w-6", inWishlist && "fill-current")} />
                                        </Button>
                                    </div>
                                </div>

                                {/* Description Expander or simple text */}
                                <div className="prose prose-sm text-gray-500 mt-6 max-w-none">
                                    <h3 className="text-gray-900 font-bold mb-2">Description</h3>
                                    <p className="leading-relaxed whitespace-pre-line">{description}</p>
                                </div>

                                {/* Trust Badges */}
                                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-100">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl">🚚</div>
                                        <div className="text-xs">
                                            <p className="font-bold text-gray-900">Free Shipping</p>
                                            <p className="text-gray-500">On orders over 500 EGP</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-xl">🛡️</div>
                                        <div className="text-xs">
                                            <p className="font-bold text-gray-900">Secure Payment</p>
                                            <p className="text-gray-500">100% protected payments</p>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Related Products */}
                    {relatedProducts.length > 0 && (
                        <div className="mt-32">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-2xl font-bold tracking-tight text-gray-900">{t.products.relatedProducts}</h2>
                                <Link to="/products" className="text-sm font-medium underline text-gray-500 hover:text-black">
                                    View All
                                </Link>
                            </div>
                            <ProductGrid
                                products={relatedProducts}
                                showViewAll={false}
                            />
                        </div>
                    )}
                </div>
            </div>
        </PageTransition>
    );
};

export default ProductPage;

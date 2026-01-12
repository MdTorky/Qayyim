import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Heart, ShoppingBag } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import { type Product, type ProductColor } from "@/types";
import { getColorDetails } from "@/utils/colorMapping";

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const { isInWishlist, toggleItem } = useWishlist();
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Normalize data
  const id = product._id || product.id || "";
  const name = language === "ar" && product.nameAr ? product.nameAr : product.name;

  // Handle images
  let displayImages: string[] = [];
  if (Array.isArray(product.image)) {
    displayImages = product.image;
  } else if (typeof product.image === "string") {
    displayImages = [product.image];
  } else if (product.images) {
    displayImages = product.images;
  }

  const mainImage = displayImages[0] || "/placeholder.jpg";
  const hoverImage = displayImages[1] || mainImage;

  const stock = product.countInStock !== undefined ? product.countInStock : (product.quantity || 0);
  const inWishlist = isInWishlist(id);

  // Normalize Colors
  const renderColor = (color: string | ProductColor) => {
    const rawName = typeof color === 'string' ? color : color.name;
    const details = getColorDetails(rawName);

    return (
      <span
        key={details.name}
        className="w-3 h-3 rounded-full border border-gray-200 ring-1 ring-transparent hover:ring-gray-300 transition-all"
        style={{ backgroundColor: details.hex }}
        title={language === "ar" ? details.nameAr : details.name}
      />
    );
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart({
      product: id,
      name: product.name,
      image: mainImage,
      price: product.price,
      countInStock: stock,
      qty: 1,
      size: product.sizes?.[0] || "",
      color: (() => {
        const c = product.colors?.[0];
        if (!c) return "";
        return typeof c === 'string' ? c : c.name;
      })()
    });
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleItem({ ...product, id });
  };

  return (
    <Link
      to={`/product/${id}`}
      className="group block h-full flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-[3/4] bg-gray-100 overflow-hidden rounded-xl mb-4">
        {/* Placeholder / Loading State */}
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

        {/* Images */}
        <img
          src={mainImage}
          alt={name}
          className={cn(
            "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
            isHovered && hoverImage !== mainImage ? "opacity-0" : "opacity-100",
            imageLoaded ? "opacity-100" : "opacity-0"
          )}
          onLoad={() => setImageLoaded(true)}
        />
        {hoverImage !== mainImage && (
          <img
            src={hoverImage}
            alt={name}
            className={cn(
              "absolute inset-0 w-full h-full object-cover transition-all duration-700",
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            )}
          />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.newArrival && (
            <span className="px-2 py-1 bg-white/90 backdrop-blur-sm text-[10px] font-bold uppercase tracking-wider text-black rounded-sm shadow-sm">
              {t.products.newArrivals}
            </span>
          )}
          {product.originalPrice && product.originalPrice > product.price && (
            <span className="px-2 py-1 bg-red-600 text-[10px] font-bold text-white rounded-sm shadow-sm">
              -{Math.round((1 - product.price / product.originalPrice) * 100)}%
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={cn(
            "absolute top-3 right-3 w-8 h-8 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-md shadow-sm transition-all duration-300 z-20 hover:bg-white hover:scale-110",
            inWishlist ? "text-red-500" : "text-gray-600 hover:text-black",
            // Mobile: always visible, Desktop: visible on hover or if active
            inWishlist ? "opacity-100" : "opacity-100 md:opacity-0 md:group-hover:opacity-100"
          )}
        >
          <Heart className={cn("w-4 h-4", inWishlist && "fill-current")} />
        </button>

        {/* Quick Add overlay */}
        <div className="absolute bottom-4 left-4 right-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 z-20 hidden md:block">
          <Button
            onClick={handleQuickAdd}
            disabled={stock === 0}
            className="w-full bg-white text-black hover:bg-black hover:text-white shadow-lg border border-transparent hover:border-black/10 transition-colors"
            size="sm"
          >
            {stock === 0 ? t.products.outOfStock : (
              <>
                <ShoppingBag className="w-4 h-4 mr-2" />
                {t.products.addToCart}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Details */}
      <div className="flex-1 flex flex-col gap-1">
        <div className="flex justify-between items-start gap-4">
          <h3 className="font-medium text-base text-gray-900 line-clamp-1 group-hover:underline decoration-1 underline-offset-4 decoration-gray-400">
            {name}
          </h3>
          {/* Price */}
          <div className="flex flex-col items-end">
            <span className="font-semibold text-sm whitespace-nowrap">
              {product.price.toLocaleString()} {t.common.egp}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-muted-foreground line-through">
                {product.originalPrice.toLocaleString()} {t.common.egp}
              </span>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">{product.category}</p>

        {/* Color swatches */}
        {product.colors && product.colors.length > 0 && (
          <div className="flex gap-1 mt-2">
            {product.colors.slice(0, 5).map(renderColor)}
            {product.colors.length > 5 && (
              <span className="text-[10px] text-gray-400 flex items-center">+{(product.colors.length - 5)}</span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;

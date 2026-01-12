import React from "react";
import { type Product } from "../../types";
import ProductCard from "./ProductCard";
import { useLanguage } from "@/context/LanguageContext";

interface ProductGridProps {
  products: Product[];
  title?: string;
  showViewAll?: boolean;
  viewAllLink?: string;
}

const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  title,
  showViewAll,
  viewAllLink = "/shop",
}) => {
  const { t } = useLanguage();

  if (products.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">{t.products.noProducts}</p>
      </div>
    );
  }

  return (
    <div>
      {title && (
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">{title}</h2>
          {showViewAll && (
            <a
              href={viewAllLink}
              className="text-sm font-medium text-accent hover:underline"
            >
              {t.common.viewAll} →
            </a>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product._id || product.id} product={product} />
        ))}
      </div>
    </div>
  );
};

export default ProductGrid;

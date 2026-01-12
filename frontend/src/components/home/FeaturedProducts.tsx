import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import ProductGrid from "@/components/products/ProductGrid";
import api from "../../utils/api";
import { Skeleton } from "@/components/ui/skeleton";

const FeaturedProducts: React.FC = () => {
  const { t, language } = useLanguage();
  const [products, setProducts] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    api.get('/products')
      .then(({ data }) => {
        if (Array.isArray(data)) {
          const featured = data.filter((p: any) => p.isFeatured).slice(0, 4);
          setProducts(featured.length > 0 ? featured : data.slice(0, 4));
        } else {
          setProducts([]);
        }
      })
      .catch(err => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="brand-section bg-gray-50/50">
      <div className="brand-container">
        <div className="mb-12 text-center md:text-start">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">
            {t.products.featured}
          </h2>
          <p className="text-muted-foreground max-w-2xl">
            {language === "ar"
              ? "مختاراتنا المفضلة لهذا الأسبوع"
              : "Our favorite picks for this week, exclusively for you."}
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[300px] w-full rounded-xl" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[250px]" />
                  <Skeleton className="h-4 w-[200px]" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <ProductGrid
            products={products}
            // Title handled above manually for better styling control
            title=""
            showViewAll={false}
          />
        )}
      </div>
    </section>
  );
};

export default FeaturedProducts;

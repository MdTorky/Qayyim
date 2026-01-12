import React from "react";
import { useLanguage } from "@/context/LanguageContext";
import ProductGrid from "@/components/products/ProductGrid";
import api from "../../utils/api";

const NewArrivals: React.FC = () => {
  const { t } = useLanguage();
  // Use 'any' for now to match the flexible structure or define a local interface
  const [products, setProducts] = React.useState<any[]>([]);

  React.useEffect(() => {
    api.get('/products')
      .then(({ data }) => {
        if (Array.isArray(data)) {
          setProducts(data.slice(0, 4));
        }
      })
      .catch(err => console.error(err));
  }, []);

  return (
    <section className="brand-section bg-secondary/30">
      <div className="brand-container">
        <ProductGrid
          products={products}
          title={t.products.newArrivals}
          showViewAll
          viewAllLink="/products?sort=newest"
        />
      </div>
    </section>
  );
};

export default NewArrivals;

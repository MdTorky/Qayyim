import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { SlidersHorizontal } from "lucide-react";
// import Layout from "@/components/layout/Layout";
import ProductGrid from "@/components/products/ProductGrid";
import ProductFilters from "@/components/products/ProductFilters";
import { useLanguage } from "@/context/LanguageContext";
import { type FilterState, type Product } from "../types";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import api from '../utils/api';
import PageTransition from "@/components/animations/PageTransition";

type SortOption = "newest" | "price-low" | "price-high" | "name";

const ProductListPage: React.FC = () => {
    const { t, language } = useLanguage();
    const [searchParams] = useSearchParams();
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
    const [sortBy, setSortBy] = useState<SortOption>("newest");
    const [allProducts, setAllProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    const [filters, setFilters] = useState<FilterState>(() => {
        const gender = searchParams.get("gender");
        const category = searchParams.get("category");

        return {
            gender: gender ? [gender] : [],
            category: category ? [category] : [],
            size: [],
            color: [],
            priceRange: [0, 5000] as [number, number],
        };
    });

    const searchQuery = searchParams.get("search") || "";
    const showNewOnly = searchParams.get("new") === "true";

    // Fetch products
    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const { data } = await api.get('/products');
                setAllProducts(Array.isArray(data) ? data : []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Update filters if URL params change
    useEffect(() => {
        const gender = searchParams.get("gender");
        const category = searchParams.get("category");
        if (gender) setFilters((prev: FilterState) => ({ ...prev, gender: [gender] }));
        if (category) setFilters((prev: FilterState) => ({ ...prev, category: [category] }));
    }, [searchParams]);

    const filteredProducts = useMemo(() => {
        let result = allProducts;

        // Search
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(p =>
                p.name.toLowerCase().includes(query) ||
                (p.nameAr && p.nameAr.includes(query)) ||
                (p.description && p.description.toLowerCase().includes(query))
            );
        }

        // New Only
        if (showNewOnly) {
            result = result.filter((p) => p.newArrival);
        }

        // Gender
        if (filters.gender.length > 0) {
            result = result.filter(p => p.gender && filters.gender.some((g: string) => g.toLowerCase() === p.gender!.toLowerCase()));
        }

        // Category
        if (filters.category.length > 0) {
            result = result.filter(p => filters.category.some((c: string) => c.toLowerCase() === p.category.toLowerCase()));
        }

        // Price
        result = result.filter(p => p.price >= filters.priceRange[0] && p.price <= filters.priceRange[1]);

        // Size (if product has sizes array)
        if (filters.size.length > 0 && result.length > 0) {
            result = result.filter(p => p.sizes && p.sizes.some((s: string) => filters.size.includes(s)));
        }

        // Color
        if (filters.color.length > 0) {
            result = result.filter(p => {
                if (!p.colors || p.colors.length === 0) return false;
                return p.colors.some((c) => {
                    const colorName = typeof c === 'string' ? c : c.name;
                    return filters.color.some(filterColor => filterColor.toLowerCase() === colorName.toLowerCase());
                });
            });
        }

        // Sort products
        switch (sortBy) {
            case "price-low":
                result.sort((a, b) => a.price - b.price);
                break;
            case "price-high":
                result.sort((a, b) => b.price - a.price);
                break;
            case "name":
                result.sort((a, b) =>
                    language === "ar"
                        ? (a.nameAr || a.name).localeCompare(b.nameAr || b.name, "ar")
                        : a.name.localeCompare(b.name)
                );
                break;
            case "newest":
            default:
                // Use _id mostly if createdAt missing, but try createdAt
                result.sort((a: any, b: any) => { // eslint-disable-line @typescript-eslint/no-explicit-any
                    const dateA = new Date(a.createdAt || 0).getTime();
                    const dateB = new Date(b.createdAt || 0).getTime();
                    return dateB - dateA;
                });
        }

        return result;
    }, [filters, searchQuery, showNewOnly, sortBy, language, allProducts]);

    if (loading) return (
        <div className="flex items-center justify-center min-h-[60vh]">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-black border-t-transparent" />
        </div>
    );

    const activeFilterCount =
        filters.gender.length +
        filters.category.length +
        filters.size.length +
        filters.color.length +
        (filters.priceRange[0] > 0 ? 1 : 0);

    return (
        <PageTransition>
            <div className="min-h-screen bg-white">
                <div className="brand-container py-8 lg:py-12">
                    {/* Header */}
                    <div className="flex flex-col gap-6 mb-10">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                            <div>
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-3">
                                    {searchQuery
                                        ? `${language === "ar" ? "نتائج البحث:" : "Search results:"} "${searchQuery}"`
                                        : showNewOnly
                                            ? t.products.newArrivals
                                            : t.nav.shop}
                                </h1>
                                <p className="text-gray-500 text-lg">
                                    {filteredProducts.length}{" "}
                                    {language === "ar" ? "منتج" : "items found"}
                                </p>
                            </div>

                            <div className="flex items-center gap-3 w-full md:w-auto">
                                {/* Mobile Filter Button */}
                                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                                    <SheetTrigger asChild className="lg:hidden flex-1 md:flex-none">
                                        <Button variant="outline" className="h-11 border-gray-300">
                                            <SlidersHorizontal className="h-4 w-4 mr-2" />
                                            {t.products.filterBy}
                                            {activeFilterCount > 0 && (
                                                <span className="ml-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black text-xs text-white">
                                                    {activeFilterCount}
                                                </span>
                                            )}
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent side="left" className="w-[85vw] sm:w-[350px] overflow-y-auto">
                                        {/* <SheetHeader className="mb-6 text-start">
                                            <SheetTitle className="text-2xl font-bold">
                                                {t.products.filterBy}
                                            </SheetTitle>
                                        </SheetHeader> */}
                                        <ProductFilters
                                            filters={filters}
                                            onFilterChange={setFilters}
                                            onClose={() => setMobileFiltersOpen(false)}
                                        />
                                    </SheetContent>
                                </Sheet>

                                {/* Sort */}
                                <Select
                                    value={sortBy}
                                    onValueChange={(value) => setSortBy(value as SortOption)}
                                >
                                    <SelectTrigger className="w-full md:w-[250px] h-11 border-gray-300 ">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <span className="text-xs uppercase font-bold tracking-wider text-gray-400 whitespace-nowrap">
                                                {t.products.sortBy}
                                            </span>
                                            <SelectValue />
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="newest">
                                            {language === "ar" ? "الأحدث" : "Newest"}
                                        </SelectItem>
                                        <SelectItem value="price-low">
                                            {language === "ar" ? "السعر: الأقل للأعلى" : "Price: Low to High"}
                                        </SelectItem>
                                        <SelectItem value="price-high">
                                            {language === "ar" ? "السعر: الأعلى للأقل" : "Price: High to Low"}
                                        </SelectItem>
                                        <SelectItem value="name">
                                            {language === "ar" ? "الاسم" : "Name"}
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="h-px bg-gray-100 w-full" />
                    </div>

                    <div className="flex gap-12 items-start">
                        {/* Desktop Filters Sidebar */}
                        <aside className="hidden lg:block w-64 shrink-0 sticky top-28 max-h-[calc(100vh-120px)] overflow-y-auto pb-10 scrollbar-none">
                            <ProductFilters filters={filters} onFilterChange={setFilters} />
                        </aside>

                        {/* Products Grid */}
                        <div className="flex-1 min-h-[500px]">
                            {filteredProducts.length > 0 ? (
                                <ProductGrid products={filteredProducts} />
                            ) : (
                                <div className="flex flex-col items-center justify-center py-20 text-center">
                                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                        <SlidersHorizontal className="w-8 h-8 text-gray-400" />
                                    </div>
                                    <h3 className="text-xl font-semibold mb-2">No products found</h3>
                                    <p className="text-gray-500 max-w-sm">
                                        Try adjusting your filters or search query to find what you're looking for.
                                    </p>
                                    <Button
                                        variant="link"
                                        className="mt-4 text-black underline"
                                        onClick={() => setFilters({
                                            gender: [],
                                            category: [],
                                            size: [],
                                            color: [],
                                            priceRange: [0, 5000],
                                        })}
                                    >
                                        Clear all filters
                                    </Button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
};

export default ProductListPage;

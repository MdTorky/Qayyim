import React from "react";
import { X, Check } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { type FilterState } from "../../types";

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onClose?: () => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onClose,
}) => {
  const { t, language } = useLanguage();

  const genderOptions = [
    { value: "Men", label: t.nav.men },
    { value: "Women", label: t.nav.women },
    { value: "Kids", label: t.nav.kids },
  ];

  const categoryOptions = [
    { value: "Hoodies", label: t.products.hoodies },
    { value: "Pants", label: t.products.pants },
    // { value: "Shoes", label: language === "ar" ? "أحذية" : "Shoes" },
    { value: "Shirts", label: language === "ar" ? "قمصان" : "Shirts" },
    // { value: "Accessories", label: language === "ar" ? "إكسسوارات" : "Accessories" },
  ];

  const sizeOptions = ["XS", "S", "M", "L", "XL", "XXL"];

  const colorOptions = [
    { value: "Black", label: language === "ar" ? "أسود" : "Black", hex: "#000000" },
    { value: "White", label: language === "ar" ? "أبيض" : "White", hex: "#ffffff" },
    { value: "Red", label: language === "ar" ? "أحمر" : "Red", hex: "#dc2626" },
    { value: "Blue", label: language === "ar" ? "أزرق" : "Blue", hex: "#2563eb" },
    { value: "Green", label: language === "ar" ? "أخضر" : "Green", hex: "#16a34a" },
    { value: "Yellow", label: language === "ar" ? "أصفر" : "Yellow", hex: "#ca8a04" },
    { value: "Purple", label: language === "ar" ? "بنفسجي" : "Purple", hex: "#9333ea" },
    { value: "Pink", label: language === "ar" ? "وردي" : "Pink", hex: "#ec4899" },
    { value: "Grey", label: language === "ar" ? "رمادي" : "Grey", hex: "#6b7280" },
    { value: "Brown", label: language === "ar" ? "بني" : "Brown", hex: "#92400e" },
    { value: "Beige", label: language === "ar" ? "بيج" : "Beige", hex: "#d2b48c" },
    { value: "Orange", label: language === "ar" ? "برتقالي" : "Orange", hex: "#ea580c" },
    { value: "Navy", label: language === "ar" ? "كحلي" : "Navy", hex: "#000080" },
    { value: "Teal", label: language === "ar" ? "فيروزي" : "Teal", hex: "#008080" },
    { value: "Maroon", label: language === "ar" ? "عنابي" : "Maroon", hex: "#800000" },
    { value: "Olive", label: language === "ar" ? "زيتوني" : "Olive", hex: "#808000" },
    { value: "Silver", label: language === "ar" ? "فضي" : "Silver", hex: "#c0c0c0" },
    { value: "Gold", label: language === "ar" ? "ذهبي" : "Gold", hex: "#ffd700" }
  ];

  const toggleFilter = (
    key: keyof Pick<FilterState, "gender" | "category" | "size" | "color">,
    value: string
  ) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    onFilterChange({ ...filters, [key]: updated });
  };

  const clearFilters = () => {
    onFilterChange({
      gender: [],
      category: [],
      size: [],
      color: [],
      priceRange: [0, 5000],
    });
  };

  const hasActiveFilters =
    filters.gender.length > 0 ||
    filters.category.length > 0 ||
    filters.size.length > 0 ||
    filters.color.length > 0 ||
    filters.priceRange[0] > 0 ||
    filters.priceRange[1] < 5000;

  return (
    <div className="h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-xl tracking-tight">{t.products.filterBy}</h3>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="text-muted-foreground hover:text-foreground text-xs h-auto py-1 px-2"
          >
            {t.products.clearFilters}
          </Button>
        )}
        {onClose && (
          <Button variant="ghost" size="icon" onClick={onClose} className="md:hidden">
            <X className="h-5 w-5" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-1">
        <Accordion type="multiple" defaultValue={["category", "price", "size", "color"]} className="w-full">

          {/* Category */}
          <AccordionItem value="category" className="border-b border-gray-100">
            <AccordionTrigger className="text-sm font-bold uppercase tracking-wider py-4 hover:no-underline hover:text-gray-600">
              {t.products.category}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-3">
                {categoryOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <Checkbox
                      checked={filters.category.includes(option.value)}
                      onCheckedChange={() => toggleFilter("category", option.value)}
                      className="rounded-sm border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{option.label}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Gender */}
          <AccordionItem value="gender" className="border-b border-gray-100">
            <AccordionTrigger className="text-sm font-bold uppercase tracking-wider py-4 hover:no-underline hover:text-gray-600">
              {t.products.gender}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="space-y-3">
                {genderOptions.map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <Checkbox
                      checked={filters.gender.includes(option.value)}
                      onCheckedChange={() => toggleFilter("gender", option.value)}
                      className="rounded-sm border-gray-300 data-[state=checked]:bg-black data-[state=checked]:border-black"
                    />
                    <span className="text-sm text-gray-600 group-hover:text-black transition-colors">{option.label}</span>
                  </label>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Price Range */}
          <AccordionItem value="price" className="border-b border-gray-100">
            <AccordionTrigger className="text-sm font-bold uppercase tracking-wider py-4 hover:no-underline hover:text-gray-600">
              {t.products.priceRange}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="px-1 pt-4 pb-2">
                <Slider
                  value={filters.priceRange}
                  onValueChange={(value) =>
                    onFilterChange({ ...filters, priceRange: value as [number, number] })
                  }
                  min={0}
                  max={5000}
                  step={100}
                  className="mb-6 cursor-pointer"
                />
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="text-gray-900 bg-gray-50 px-2 py-1 rounded">
                    {filters.priceRange[0].toLocaleString()} {t.common.egp}
                  </span>
                  <span className="text-gray-400">-</span>
                  <span className="text-gray-900 bg-gray-50 px-2 py-1 rounded">
                    {filters.priceRange[1].toLocaleString()} {t.common.egp}
                  </span>
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Size */}
          <AccordionItem value="size" className="border-b border-gray-100">
            <AccordionTrigger className="text-sm font-bold uppercase tracking-wider py-4 hover:no-underline hover:text-gray-600">
              {t.products.size}
            </AccordionTrigger>
            <AccordionContent className="pb-4">
              <div className="grid grid-cols-3 gap-2">
                {sizeOptions.map((size) => (
                  <button
                    key={size}
                    onClick={() => toggleFilter("size", size)}
                    className={`
                        h-10 text-sm font-medium border rounded-md transition-all
                        ${filters.size.includes(size)
                        ? "bg-black text-white border-black"
                        : "bg-white text-gray-600 border-gray-200 hover:border-gray-900 hover:text-black"
                      }
                      `}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>

          {/* Color */}
          <AccordionItem value="color" className="border-none">
            <AccordionTrigger className="text-sm font-bold uppercase tracking-wider py-4 px-4 hover:no-underline hover:text-gray-600">
              {t.products.color}
            </AccordionTrigger>
            <AccordionContent className="p-4">
              <div className="flex flex-wrap gap-3">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => toggleFilter("color", color.value)}
                    className={`
                        w-8 h-8 rounded-full flex items-center justify-center transition-all relative
                        ${filters.color.includes(color.value)
                        ? "ring-2 ring-offset-2 ring-black scale-110"
                        : "hover:scale-110 ring-1 ring-transparent hover:ring-gray-200"
                      }
                      `}
                    style={{ backgroundColor: color.hex }}
                    title={color.label}
                  >
                    {color.hex === "#ffffff" && <span className="absolute inset-0 rounded-full border border-gray-200" />}
                    {filters.color.includes(color.value) && (
                      <Check className={`w-3.5 h-3.5 ${color.hex === "#ffffff" ? "text-black" : "text-white"}`} />
                    )}
                  </button>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default ProductFilters;

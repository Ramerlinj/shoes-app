"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import type { FilterState, Product } from "@/types/product";

interface ProductFiltersProps {
  products: Product[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  onClearAll: () => void;
}

interface FilterSectionProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function FilterSection({ title, children, defaultOpen = true }: FilterSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b pb-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between py-2 text-left font-medium hover:text-gray-600 transition-colors"
      >
        {title}
        {isOpen ? (
          <ChevronUp className="h-4 w-4" />
        ) : (
          <ChevronDown className="h-4 w-4" />
        )}
      </button>
      {isOpen && <div className="pt-2 space-y-2">{children}</div>}
    </div>
  );
}

export function ProductFilters({ products, filters, onFiltersChange, onClearAll }: ProductFiltersProps) {
  const [isVisible, setIsVisible] = useState(true);

  // Extract unique values from products
  const uniqueCategories = [...new Set(products.map(p => p.category))].sort();
  const uniqueBrands = [...new Set(products.map(p => p.brand))].sort();
  const uniqueGenders = [...new Set(products.map(p => p.gender))].sort();
  const uniqueSizes = [...new Set(products.flatMap(p => p.sizes))].sort((a, b) => a - b);
  const uniqueColors = [...new Set(products.flatMap(p => p.colors.map(c => c.name)))].sort();

  const handleCategoryChange = (category: string, checked: boolean) => {
    const newCategories = checked
      ? [...filters.category, category]
      : filters.category.filter(c => c !== category);
    
    onFiltersChange({ ...filters, category: newCategories });
  };

  const handleBrandChange = (brand: string, checked: boolean) => {
    const newBrands = checked
      ? [...filters.brand, brand]
      : filters.brand.filter(b => b !== brand);
    
    onFiltersChange({ ...filters, brand: newBrands });
  };

  const handleGenderChange = (gender: string, checked: boolean) => {
    const newGenders = checked
      ? [...filters.gender, gender]
      : filters.gender.filter(g => g !== gender);
    
    onFiltersChange({ ...filters, gender: newGenders });
  };

  const handleSizeChange = (size: number, checked: boolean) => {
    const newSizes = checked
      ? [...filters.sizes, size]
      : filters.sizes.filter(s => s !== size);
    
    onFiltersChange({ ...filters, sizes: newSizes });
  };

  const handleColorChange = (color: string, checked: boolean) => {
    const newColors = checked
      ? [...filters.colors, color]
      : filters.colors.filter(c => c !== color);
    
    onFiltersChange({ ...filters, colors: newColors });
  };

  const handleInStockChange = (checked: boolean) => {
    onFiltersChange({ ...filters, inStock: checked });
  };

  const handlePriceRangeChange = (min: number, max: number) => {
    onFiltersChange({ ...filters, priceRange: [min, max] });
  };

  const activeFiltersCount = 
    filters.category.length + 
    filters.brand.length + 
    filters.gender.length + 
    filters.sizes.length + 
    filters.colors.length + 
    (filters.inStock ? 1 : 0);

  if (!isVisible) {
    return (
      <Button
        variant="outline"
        onClick={() => setIsVisible(true)}
        className="lg:hidden fixed top-20 left-4 z-10"
      >
        <Filter className="h-4 w-4 mr-2" />
        Filtros {activeFiltersCount > 0 && `(${activeFiltersCount})`}
      </Button>
    );
  }

  return (
    <div className="w-full lg:w-80 bg-white border-r p-4 space-y-4 h-fit lg:sticky lg:top-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="font-semibold text-lg">Filtros</h2>
          {activeFiltersCount > 0 && (
            <span className="bg-black text-white text-xs px-2 py-1 rounded-full">
              {activeFiltersCount}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onClearAll}>
              Limpiar
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsVisible(false)}
            className="lg:hidden"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Separator />

      {/* In Stock Filter */}
      <div className="flex items-center space-x-2">
        <Checkbox
          id="inStock"
          checked={filters.inStock}
          onCheckedChange={handleInStockChange}
        />
        <Label htmlFor="inStock" className="text-sm font-medium">
          Solo productos disponibles
        </Label>
      </div>

      <Separator />

      {/* Category Filter */}
      <FilterSection title="Categoría">
        {uniqueCategories.map(category => (
          <div key={category} className="flex items-center space-x-2">
            <Checkbox
              id={`category-${category}`}
              checked={filters.category.includes(category)}
              onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
            />
            <Label htmlFor={`category-${category}`} className="text-sm capitalize cursor-pointer">
              {category}
            </Label>
          </div>
        ))}
      </FilterSection>

      {/* Brand Filter */}
      <FilterSection title="Marca">
        {uniqueBrands.map(brand => (
          <div key={brand} className="flex items-center space-x-2">
            <Checkbox
              id={`brand-${brand}`}
              checked={filters.brand.includes(brand)}
              onCheckedChange={(checked) => handleBrandChange(brand, checked as boolean)}
            />
            <Label htmlFor={`brand-${brand}`} className="text-sm cursor-pointer">
              {brand}
            </Label>
          </div>
        ))}
      </FilterSection>

      {/* Gender Filter */}
      <FilterSection title="Género">
        {uniqueGenders.map(gender => (
          <div key={gender} className="flex items-center space-x-2">
            <Checkbox
              id={`gender-${gender}`}
              checked={filters.gender.includes(gender)}
              onCheckedChange={(checked) => handleGenderChange(gender, checked as boolean)}
            />
            <Label htmlFor={`gender-${gender}`} className="text-sm capitalize cursor-pointer">
              {gender === 'men' ? 'Hombre' : gender === 'women' ? 'Mujer' : 'Unisex'}
            </Label>
          </div>
        ))}
      </FilterSection>

      {/* Size Filter */}
      <FilterSection title="Tallas">
        <div className="grid grid-cols-4 gap-2">
          {uniqueSizes.map(size => (
            <div key={size} className="flex items-center space-x-1">
              <Checkbox
                id={`size-${size}`}
                checked={filters.sizes.includes(size)}
                onCheckedChange={(checked) => handleSizeChange(size, checked as boolean)}
              />
              <Label htmlFor={`size-${size}`} className="text-xs cursor-pointer">
                {size}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>

      {/* Price Range Filter */}
      <FilterSection title="Precio">
        <div className="space-y-2">
          <div className="flex gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceRange[0]}
              onChange={(e) => handlePriceRangeChange(Number(e.target.value), filters.priceRange[1])}
              className="w-full px-2 py-1 border rounded text-sm"
            />
            <input
              type="number"
              placeholder="Max"
              value={filters.priceRange[1]}
              onChange={(e) => handlePriceRangeChange(filters.priceRange[0], Number(e.target.value))}
              className="w-full px-2 py-1 border rounded text-sm"
            />
          </div>
          <div className="text-xs text-gray-500">
            Rango: ${Math.min(...products.map(p => p.price))} - ${Math.max(...products.map(p => p.price))}
          </div>
        </div>
      </FilterSection>

      {/* Color Filter */}
      <FilterSection title="Colores">
        <div className="grid grid-cols-2 gap-2">
          {uniqueColors.map(color => (
            <div key={color} className="flex items-center space-x-2">
              <Checkbox
                id={`color-${color}`}
                checked={filters.colors.includes(color)}
                onCheckedChange={(checked) => handleColorChange(color, checked as boolean)}
              />
              <Label htmlFor={`color-${color}`} className="text-xs cursor-pointer truncate">
                {color}
              </Label>
            </div>
          ))}
        </div>
      </FilterSection>
    </div>
  );
}
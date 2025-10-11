"use client";

import { useState, useMemo, useCallback } from "react";
import { Search, X, Star, Heart, ShoppingCart, Plus, Minus } from "lucide-react";
import { ProductCard } from "@/app/products/_components/ProductCard";
import { ProductFilters } from "@/app/products/_components/ProductFilters";
import { ProductSort } from "@/app/products/_components/ProductSort";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import type { Product, FilterState, SortOption } from "@/types/product";
import productsData from "@/data/products.json";
import { useCart } from "@/hooks/useCart";

const ITEMS_PER_PAGE = 12;

export default function ProductsPage() {
  const products = productsData as Product[];
  const { addItem } = useCart();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<FilterState>({
    category: [],
    brand: [],
    gender: [],
    priceRange: [0, 300],
    sizes: [],
    colors: [],
    inStock: false
  });
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [currentPage, setCurrentPage] = useState(1);
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedSize, setSelectedSize] = useState<number | null>(null);
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = products.filter(product => {
      // Search term
      if (searchTerm && !product.name.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !product.brand.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))) {
        return false;
      }

      // Category filter
      if (filters.category.length > 0 && !filters.category.includes(product.category)) {
        return false;
      }

      // Brand filter
      if (filters.brand.length > 0 && !filters.brand.includes(product.brand)) {
        return false;
      }

      // Gender filter
      if (filters.gender.length > 0 && !filters.gender.includes(product.gender)) {
        return false;
      }

      // Price range
      if (product.price < filters.priceRange[0] || product.price > filters.priceRange[1]) {
        return false;
      }

      // Sizes filter
      if (filters.sizes.length > 0 && !filters.sizes.some(size => product.sizes.includes(size))) {
        return false;
      }

      // Colors filter
      if (filters.colors.length > 0 && !filters.colors.some(color => 
        product.colors.some(c => c.name === color))) {
        return false;
      }

      // In stock filter
      if (filters.inStock && product.stock === 0) {
        return false;
      }

      return true;
    });

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'popular':
          return b.stock - a.stock; // Mock popularity by stock
        case 'newest':
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [products, searchTerm, filters, sortBy]);

  // Pagination
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const clearAllFilters = useCallback(() => {
    setFilters({
      category: [],
      brand: [],
      gender: [],
      priceRange: [0, 300],
      sizes: [],
      colors: [],
      inStock: false
    });
    setSearchTerm("");
    setCurrentPage(1);
  }, []);

  const handleToggleWishlist = useCallback((productId: string) => {
    setWishlist(prev => {
      const newWishlist = new Set(prev);
      if (newWishlist.has(productId)) {
        newWishlist.delete(productId);
      } else {
        newWishlist.add(productId);
      }
      return newWishlist;
    });
  }, []);

  const handleQuickView = useCallback((product: Product) => {
    setQuickViewProduct(product);
    setSelectedColorIndex(0);
    setSelectedSize(null);
    setQuantity(1);
  }, []);

  const handleAddToCart = useCallback(
    (
      product: Product,
      options?: { size?: number; color?: string; quantity?: number; imageIndex?: number }
    ) => {
      const chosenSize = options?.size ?? product.sizes[0];
      const chosenColor = options?.color ?? product.colors[options?.imageIndex ?? 0]?.name;
      const imageIndex = options?.imageIndex ?? 0;
      const image = product.images[imageIndex] || product.thumbnail;
      const quantityToAdd = options?.quantity ?? 1;

      addItem(
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          currency: product.currency,
          image,
          size: chosenSize,
          color: chosenColor,
          stock: product.stock,
        },
        quantityToAdd,
      );
    },
    [addItem],
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">Zapatería RD catalog</h1>
              <p className="text-gray-600 mt-1">
                Discover our full lineup of sport and lifestyle sneakers curated for the Dominican Republic
              </p>
            </div>
            
            {/* Search Bar */}
            <div className="relative max-w-md w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search sneakers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-10"
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchTerm("")}
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto flex">
        {/* Filters Sidebar */}
        <div className="hidden lg:block">
          <ProductFilters
            products={products}
            filters={filters}
            onFiltersChange={setFilters}
            onClearAll={clearAllFilters}
          />
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Sort Controls */}
          <ProductSort
            sortBy={sortBy}
            onSortChange={setSortBy}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            totalResults={filteredProducts.length}
            currentPage={currentPage}
            totalPages={totalPages}
          />

          {/* Mobile Filters Button */}
          <div className="lg:hidden p-4">
            <ProductFilters
              products={products}
              filters={filters}
              onFiltersChange={setFilters}
              onClearAll={clearAllFilters}
            />
          </div>

          {/* Products Grid/List */}
          <div className="p-4">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 mb-4">
                  <Search className="mx-auto h-12 w-12" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-500 mb-4">
                  Try adjusting the filters or your search.
                </p>
                <Button onClick={clearAllFilters} variant="outline">
                  Clear filters
                </Button>
              </div>
            ) : (
              <>
                <div className={
                  viewMode === 'grid' 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }>
                  {paginatedProducts.map(product => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      onQuickView={handleQuickView}
                      onAddToCart={handleAddToCart}
                      onToggleWishlist={handleToggleWishlist}
                      isInWishlist={wishlist.has(product.id)}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center gap-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </Button>
                    
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(page => 
                          page === 1 || 
                          page === totalPages || 
                          Math.abs(page - currentPage) <= 2
                        )
                        .map((page, index, array) => (
                          <div key={page}>
                            {index > 0 && array[index - 1] !== page - 1 && (
                              <span className="px-2 py-2 text-gray-500">...</span>
                            )}
                            <Button
                              variant={currentPage === page ? "default" : "outline"}
                              size="sm"
                              onClick={() => setCurrentPage(page)}
                            >
                              {page}
                            </Button>
                          </div>
                        ))
                      }
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Quick View Modal */}
      {quickViewProduct && (
        <Dialog open={!!quickViewProduct} onOpenChange={() => setQuickViewProduct(null)}>
          <DialogContent
            maxWidth="min(96vw, 1400px)"
            className="max-h-[95vh] overflow-y-auto overflow-x-hidden"
          >
            <DialogHeader className="pb-3">
              <DialogTitle className="text-2xl font-bold text-dodger-blue-900">
                {quickViewProduct.name}
              </DialogTitle>
            </DialogHeader>
            
            <div className="grid lg:grid-cols-[1.5fr_1fr] xl:grid-cols-[1.7fr_1fr] gap-10 xl:gap-14">
              {/* Product Images */}
              <div className="space-y-5">
                <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border shadow-md max-w-full">
                  <img
                    src={quickViewProduct.images[selectedColorIndex] || quickViewProduct.thumbnail}
                    alt={quickViewProduct.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
                
                {quickViewProduct.images.length > 1 && (
                  <div className="grid grid-cols-5 gap-2.5">
                    {quickViewProduct.images.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedColorIndex(index)}
                        className={`aspect-square rounded-lg overflow-hidden border transition-all duration-200 ${
                          selectedColorIndex === index
                            ? 'border-dodger-blue-900 ring-2 ring-dodger-blue-200'
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={image}
                          alt={`View ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Details */}
              <div className="space-y-7 px-2 lg:px-4">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge className="bg-dodger-blue-900 text-white uppercase text-xs font-semibold tracking-wide px-3 py-1.5">
                      {quickViewProduct.brand}
                    </Badge>
                    <button
                      onClick={() => handleToggleWishlist(quickViewProduct.id)}
                      className="p-2.5 hover:bg-gray-100 rounded-full transition-colors duration-200"
                    >
                      <Heart 
                        className={`h-5 w-5 transition-colors ${
                          wishlist.has(quickViewProduct.id) 
                            ? 'fill-red-500 text-red-500' 
                            : 'text-gray-400 hover:text-red-400'
                        }`} 
                      />
                    </button>
                  </div>
                  
                  <h3 className="text-[28px] font-semibold text-gray-900 leading-tight">
                    {quickViewProduct.name}
                  </h3>
                  
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-600">
                    <div className="flex items-center bg-yellow-50 px-3 py-1.5 rounded-md">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-5 w-5 ${
                            i < Math.floor(quickViewProduct.rating)
                              ? 'text-yellow-500 fill-yellow-500'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="font-medium">
                      ({quickViewProduct.rating})
                    </span>
                    <span className="text-gray-400">•</span>
                    <Badge 
                      variant={quickViewProduct.stock > 10 ? "secondary" : "destructive"}
                      className="text-xs px-3 py-1"
                    >
                      {quickViewProduct.stock > 10 
                        ? `${quickViewProduct.stock} in stock` 
                        : `Only ${quickViewProduct.stock} pairs left`
                      }
                    </Badge>
                  </div>
                </div>

                <div className="bg-gray-50 border border-gray-100 p-5 rounded-xl space-y-3">
                  <div className="flex items-baseline gap-2">
                    <span className="text-3xl font-semibold text-dodger-blue-900">
                      ${quickViewProduct.price}
                    </span>
                    <span className="text-base text-gray-500 font-medium">
                      {quickViewProduct.currency}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 leading-relaxed text-base">
                    {quickViewProduct.description}
                  </p>
                </div>

                {/* Colors */}
                {quickViewProduct.colors.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-base">
                      Color: <span className="text-dodger-blue-900">{quickViewProduct.colors[selectedColorIndex]?.name}</span>
                    </h4>
                    <div className="flex flex-wrap gap-2.5">
                      {quickViewProduct.colors.map((color, index) => (
                        <button
                          key={color.name}
                          onClick={() => setSelectedColorIndex(index)}
                          className={`w-11 h-11 rounded-full border transition-all duration-200 ${
                            selectedColorIndex === index
                              ? 'border-dodger-blue-900 ring-2 ring-dodger-blue-200'
                              : 'border-gray-200 hover:border-gray-400'
                          }`}
                          style={{ backgroundColor: color.hex }}
                          title={color.name}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Sizes */}
                {quickViewProduct.sizes.length > 0 && (
                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 text-base">
                  Size {selectedSize && <span className="text-dodger-blue-900">({selectedSize})</span>}
                    </h4>
                    <div className="grid grid-cols-6 gap-2.5">
                      {quickViewProduct.sizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`py-3 px-3 border rounded-lg text-center text-sm font-medium transition-colors duration-150 ${
                            selectedSize === size
                              ? 'border-dodger-blue-900 bg-dodger-blue-900 text-white'
                              : 'border-gray-300 hover:border-dodger-blue-300 hover:bg-dodger-blue-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quantity */}
                <div>
                  <h4 className="font-semibold mb-3 text-gray-900 text-base">Quantity</h4>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center border rounded-lg bg-white shadow-sm">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="p-3 hover:bg-gray-100 transition-colors duration-200 rounded-l-lg"
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="px-6 py-3 border-x font-semibold text-lg min-w-[72px] text-center">{quantity}</span>
                      <button
                        onClick={() => setQuantity(Math.min(quickViewProduct.stock, quantity + 1))}
                        className="p-3 hover:bg-gray-100 transition-colors duration-200 rounded-r-lg"
                        disabled={quantity >= quickViewProduct.stock}
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                    <span className="text-sm text-gray-500 font-medium">
                      Max: {quickViewProduct.stock}
                    </span>
                  </div>
                </div>

                {/* Tags */}
                {quickViewProduct.tags.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900 text-base">Highlights</h4>
                    <div className="flex flex-wrap gap-2">
                      {quickViewProduct.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs border-dodger-blue-200 text-dodger-blue-800">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-4 pt-5">
                  <div className="flex flex-wrap gap-4">
                    <Button
                      onClick={() => {
                        handleAddToCart(quickViewProduct, {
                          size: selectedSize ?? quickViewProduct.sizes[0],
                          color: quickViewProduct.colors[selectedColorIndex]?.name,
                          quantity,
                          imageIndex: selectedColorIndex,
                        });
                        setQuickViewProduct(null);
                      }}
                      disabled={quickViewProduct.stock === 0 || !selectedSize}
                      className="flex-1 min-w-[220px] bg-dodger-blue-900 hover:bg-dodger-blue-800 text-white py-5 text-lg font-semibold transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {quickViewProduct.stock === 0 
                        ? 'Sold out' 
                        : !selectedSize 
                          ? 'Select a size' 
                          : `Add to cart - $${(quickViewProduct.price * quantity).toFixed(2)}`
                      }
                    </Button>
                    
                    <Button
                      variant="outline"
                      onClick={() => handleToggleWishlist(quickViewProduct.id)}
                      className={`px-5 py-5 transition-all duration-200 ${
                        wishlist.has(quickViewProduct.id)
                          ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
                          : 'border-dodger-blue-200 text-dodger-blue-900 hover:bg-dodger-blue-50 hover:border-dodger-blue-300'
                      }`}
                    >
                      <Heart className={`h-5 w-5 ${wishlist.has(quickViewProduct.id) ? 'fill-current' : ''}`} />
                    </Button>
                  </div>
                  
                  <Button
                    variant="outline"
                    onClick={() => setQuickViewProduct(null)}
                    className="w-full border-gray-300 text-gray-600 hover:bg-gray-50 py-3 text-base"
                  >
                    Continue shopping
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

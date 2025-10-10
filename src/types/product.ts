export interface ProductColor {
  name: string;
  hex: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  gender: string;
  price: number;
  currency: string;
  images: string[];
  thumbnail: string;
  sizes: number[];
  colors: ProductColor[];
  stock: number;
  rating: number;
  description: string;
  tags: string[];
}

export interface FilterState {
  category: string[];
  brand: string[];
  gender: string[];
  priceRange: [number, number];
  sizes: number[];
  colors: string[];
  inStock: boolean;
}

export type SortOption = 'newest' | 'price-low' | 'price-high' | 'rating' | 'popular';

export interface ProductFilters {
  searchTerm?: string;
  category?: string[];
  brand?: string[];
  gender?: string[];
  priceRange?: [number, number];
  sizes?: number[];
  colors?: string[];
  inStock?: boolean;
  sortBy?: SortOption;
}
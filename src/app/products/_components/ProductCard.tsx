"use client";

import { useState } from "react";
import { Heart, Star } from "lucide-react";
import type { Product } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface ProductCardProps {
  product: Product;
  onQuickView?: (product: Product) => void;
  onAddToCart?: (
    product: Product,
    options?: { size?: number; color?: string; imageIndex?: number }
  ) => void;
  onToggleWishlist?: (productId: string) => void;
  isInWishlist?: boolean;
}

export function ProductCard({ 
  product, 
  onQuickView, 
  onAddToCart, 
  onToggleWishlist,
  isInWishlist = false 
}: ProductCardProps) {
  const [selectedColorIndex, setSelectedColorIndex] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);

  const currentImage = product.images[selectedColorIndex] || product.thumbnail;
  const selectedColor = product.colors[selectedColorIndex]?.name;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  return (
    <div className="group relative bg-white rounded-lg overflow-hidden border hover:shadow-lg transition-all duration-300">
      <button
        onClick={() => onToggleWishlist?.(product.id)}
        className="absolute top-3 right-3 z-10 p-2 bg-white/80 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-white"
      >
        <Heart 
          className={`h-4 w-4 ${isInWishlist ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} 
        />
      </button>

      <div className="relative aspect-square bg-gray-50 overflow-hidden">
        <img
          src={currentImage}
          alt={product.name}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-105 ${
            imageLoaded ? 'opacity-100' : 'opacity-0'
          }`}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
        
    
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse" />
        )}

  
        <div className="absolute top-3 left-3 flex flex-col gap-1">
          {product.stock === 0 && (
            <Badge variant="destructive" className="text-xs">
              Sold out
            </Badge>
          )}
          {isLowStock && (
            <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-800">
              Only {product.stock} left
            </Badge>
          )}
        </div>

            <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onQuickView?.(product)}
            className="bg-white text-black hover:bg-gray-100"
          >
            Quick view
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span className="uppercase font-medium">{product.brand}</span>
          <span className="capitalize">{product.category}</span>
        </div>

        <h3 className="font-medium text-sm leading-tight line-clamp-2 group-hover:text-gray-600 transition-colors">
          {product.name}
        </h3>

        <div className="flex items-center gap-1">
          <div className="flex items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={`h-3 w-3 ${
                  i < Math.floor(product.rating)
                    ? 'text-yellow-400 fill-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="text-xs text-gray-500 ml-1">
            ({product.rating})
          </span>
        </div>

        {product.colors.length > 0 && (
          <div className="space-y-2">
            <p className="text-xs text-gray-600">
              {product.colors.length} color{product.colors.length !== 1 ? 's' : ''}
            </p>
            <div className="flex gap-1">
              {product.colors.slice(0, 4).map((color, index) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColorIndex(index)}
                  className={`w-6 h-6 rounded-full border-2 transition-all ${
                    selectedColorIndex === index
                      ? 'border-black scale-110'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
              {product.colors.length > 4 && (
                <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-gray-100 flex items-center justify-center">
                  <span className="text-xs text-gray-600">+{product.colors.length - 4}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-2">
          <div className="flex flex-col">
            <span className="font-bold text-lg">
              ${product.price}
            </span>
            {product.currency !== 'USD' && (
              <span className="text-xs text-gray-500">{product.currency}</span>
            )}
          </div>
          
          <Button
            size="sm"
            onClick={() =>
              onAddToCart?.(product, {
                size: product.sizes[0],
                color: selectedColor,
                imageIndex: selectedColorIndex,
              })
            }
            disabled={product.stock === 0}
            className="bg-black text-white hover:bg-gray-800 disabled:opacity-50"
          >
            {product.stock === 0 ? 'Sold out' : 'Add to cart'}
          </Button>
        </div>

        {product.sizes.length > 0 && (
          <div className="text-xs text-gray-500 pt-1">
            Sizes: {product.sizes.slice(0, 3).join(', ')}
            {product.sizes.length > 3 && ` +${product.sizes.length - 3} more`}
          </div>
        )}
      </div>
    </div>
  );
}
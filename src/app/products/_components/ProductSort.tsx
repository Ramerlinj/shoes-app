"use client";

import { LayoutGrid, List } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { SortOption } from "@/types/product";

interface ProductSortProps {
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalResults: number;
  currentPage?: number;
  totalPages?: number;
}

export function ProductSort({ 
  sortBy, 
  onSortChange, 
  viewMode, 
  onViewModeChange, 
  totalResults,
  currentPage = 1,
  totalPages = 1
}: ProductSortProps) {
  
  const sortOptions = [
    { value: 'newest' as SortOption, label: 'Newest' },
    { value: 'popular' as SortOption, label: 'Most popular' },
    { value: 'price-low' as SortOption, label: 'Price: low to high' },
    { value: 'price-high' as SortOption, label: 'Price: high to low' },
    { value: 'rating' as SortOption, label: 'Top rated' },
  ];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border-b p-4 sticky top-0 z-10">
      {/* Results Count and Pagination Info */}
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-600">
          {totalResults} result{totalResults !== 1 ? 's' : ''}
        </span>
        {totalPages > 1 && (
          <span className="text-sm text-gray-500">
            Page {currentPage} of {totalPages}
          </span>
        )}
      </div>

      {/* Sort and View Controls */}
      <div className="flex items-center gap-3">
        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 hidden sm:block">Sort by:</span>
          <Select value={sortBy} onValueChange={onSortChange}>
            <SelectTrigger className="w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map(option => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center border rounded-md">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className="rounded-r-none"
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className="rounded-l-none border-l"
          >
            <List className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
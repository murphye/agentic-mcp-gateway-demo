"use client";

import type { Product } from "@/lib/hooks/use-products";
import { ProductCard } from "./product-card";

interface ProductGridProps {
  products: Product[];
  categorySlug?: string;
}

export function ProductGrid({ products, categorySlug }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-6xl mb-4">🍐</div>
        <h3 className="text-xl font-semibold text-gray-dark mb-2">
          No products found
        </h3>
        <p className="text-gray-medium">
          Check back soon for new arrivals!
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          categorySlug={categorySlug}
        />
      ))}
    </div>
  );
}

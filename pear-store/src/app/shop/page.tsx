"use client";

import { ProductGrid } from "@/components/products";
import { Button } from "@/components/ui";
import { useProducts, useCategories } from "@/lib/hooks/use-products";
import { useState } from "react";

const categoryOptions = [
  { label: "All Products", value: "" },
  { label: "PearPhone", value: "pearphone" },
  { label: "PearBook", value: "pearbook" },
  { label: "PearPad", value: "pearpad" },
  { label: "PearWatch", value: "pearwatch" },
  { label: "PearPods", value: "pearpods" },
  { label: "Accessories", value: "accessories" },
];

export default function ShopPage() {
  const [selectedCategory, setSelectedCategory] = useState("");
  const { data: productsData, isLoading } = useProducts({
    category: selectedCategory || undefined,
    status: "active",
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gray-light py-16">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h1 className="text-3xl lg:text-5xl font-bold text-gray-dark text-center">
            Shop
          </h1>
          <p className="text-lg text-gray-medium text-center mt-4">
            Find the perfect Pear product for you.
          </p>
        </div>
      </section>

      {/* Filters & Products */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2 mb-12 justify-center">
            {categoryOptions.map((option) => (
              <Button
                key={option.value}
                variant={selectedCategory === option.value ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(option.value)}
              >
                {option.label}
              </Button>
            ))}
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-gray-light animate-pulse"
                />
              ))}
            </div>
          ) : (
            <ProductGrid
              products={productsData?.products || []}
              categorySlug={selectedCategory || "products"}
            />
          )}
        </div>
      </section>
    </div>
  );
}

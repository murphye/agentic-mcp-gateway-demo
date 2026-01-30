"use client";

import { ProductGrid } from "@/components/products";
import { useProducts } from "@/lib/hooks/use-products";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { use } from "react";

const categoryInfo: Record<string, { title: string; description: string; emoji: string }> = {
  pearphone: {
    title: "PearPhone",
    description: "The ultimate smartphone experience. Powerful. Beautiful. Yours.",
    emoji: "📱",
  },
  pearbook: {
    title: "PearBook",
    description: "Supercharged for pros. Built for everyone.",
    emoji: "💻",
  },
  pearpad: {
    title: "PearPad",
    description: "Your next computer is not a computer.",
    emoji: "📱",
  },
  pearwatch: {
    title: "PearWatch",
    description: "The ultimate device for a healthy life.",
    emoji: "⌚",
  },
  pearpods: {
    title: "PearPods",
    description: "Wireless. Effortless. Magical.",
    emoji: "🎧",
  },
  peartv: {
    title: "PearTV",
    description: "The future of television.",
    emoji: "📺",
  },
  accessories: {
    title: "Accessories",
    description: "Explore cases, covers, chargers, and more.",
    emoji: "🔌",
  },
  software: {
    title: "Software",
    description: "Apps and services to enhance your Pear experience.",
    emoji: "💿",
  },
};

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category } = use(params);

  // Redirect /shop/products to /shop
  if (category === "products") {
    redirect("/shop");
  }

  const info = categoryInfo[category] || {
    title: category.charAt(0).toUpperCase() + category.slice(1),
    description: "Explore our products.",
    emoji: "🍐",
  };

  const { data: productsData, isLoading } = useProducts({
    category: category,
    status: "active",
  });

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gray-light py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Link
            href="/shop"
            className="inline-flex items-center text-sm text-gray-medium hover:text-gray-dark mb-8"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Shop
          </Link>
          <div className="text-center">
            <div className="text-6xl mb-4">{info.emoji}</div>
            <h1 className="text-3xl lg:text-5xl font-bold text-gray-dark">
              {info.title}
            </h1>
            <p className="text-lg text-gray-medium mt-4 max-w-xl mx-auto">
              {info.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
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
              categorySlug={category}
            />
          )}
        </div>
      </section>
    </div>
  );
}

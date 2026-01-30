"use client";

import { Button } from "@/components/ui";
import { ProductGrid } from "@/components/products";
import { useProducts } from "@/lib/hooks/use-products";
import { ChevronRight } from "lucide-react";
import Link from "next/link";

const categories = [
  { name: "PearPhone", slug: "pearphone", emoji: "📱" },
  { name: "PearBook", slug: "pearbook", emoji: "💻" },
  { name: "PearPad", slug: "pearpad", emoji: "📱" },
  { name: "PearWatch", slug: "pearwatch", emoji: "⌚" },
  { name: "PearPods", slug: "pearpods", emoji: "🎧" },
  { name: "Accessories", slug: "accessories", emoji: "🔌" },
];

export default function HomePage() {
  const { data: productsData, isLoading } = useProducts({ limit: 8, status: "active" });

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gray-light py-20 lg:py-32">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="text-center">
            <div className="text-8xl mb-6">🍐</div>
            <h1 className="text-4xl lg:text-6xl font-bold text-gray-dark mb-4">
              PearPhone 16 Pro
            </h1>
            <p className="text-xl lg:text-2xl text-gray-medium mb-8">
              The most powerful PearPhone ever. With P3 chip.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/shop/pearphone">
                  Shop PearPhone
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/shop/pearphone/PEAR-PPH-1601">
                  Learn More
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-dark text-center mb-12">
            Explore the lineup.
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 lg:gap-6">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/shop/${category.slug}`}
                className="group flex flex-col items-center p-6 rounded-2xl bg-white border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <span className="text-4xl lg:text-5xl mb-3">{category.emoji}</span>
                <span className="font-medium text-gray-dark group-hover:text-pear-dark transition-colors">
                  {category.name}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-gray-light">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-dark">
              Featured Products
            </h2>
            <Button variant="ghost" asChild>
              <Link href="/shop" className="flex items-center gap-1">
                Shop All
                <ChevronRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square rounded-2xl bg-white animate-pulse"
                />
              ))}
            </div>
          ) : (
            <ProductGrid products={productsData?.products || []} />
          )}
        </div>
      </section>

      {/* Promo Banner */}
      <section className="py-16 lg:py-24 bg-pear">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <h2 className="text-2xl lg:text-4xl font-bold text-gray-dark mb-4">
            Trade in your old device.
          </h2>
          <p className="text-lg text-gray-dark/80 mb-8 max-w-2xl mx-auto">
            Get credit toward a new Pear product when you trade in your eligible device.
            Good for you and the planet.
          </p>
          <Button variant="dark" size="lg" asChild>
            <Link href="/trade-in">
              See what your device is worth
            </Link>
          </Button>
        </div>
      </section>

      {/* Support Section */}
      <section className="py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-8">
              <div className="text-4xl mb-4">💬</div>
              <h3 className="text-xl font-semibold text-gray-dark mb-2">
                Need help?
              </h3>
              <p className="text-gray-medium mb-4">
                Chat with a Pear Specialist for expert advice.
              </p>
              <Button variant="link" asChild>
                <Link href="/support">Get support</Link>
              </Button>
            </div>
            <div className="text-center p-8">
              <div className="text-4xl mb-4">📍</div>
              <h3 className="text-xl font-semibold text-gray-dark mb-2">
                Visit a store
              </h3>
              <p className="text-gray-medium mb-4">
                Experience our products and get expert help.
              </p>
              <Button variant="link" asChild>
                <Link href="/stores">Find a store</Link>
              </Button>
            </div>
            <div className="text-center p-8">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold text-gray-dark mb-2">
                Free delivery
              </h3>
              <p className="text-gray-medium mb-4">
                Free delivery on all orders over $50.
              </p>
              <Button variant="link" asChild>
                <Link href="/shop">Start shopping</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

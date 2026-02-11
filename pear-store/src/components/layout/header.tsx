"use client";

import { useCartStore } from "@/stores/cart-store";
import { Menu, Search, ShoppingBag, Sparkles, User, X } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

const navigation = [
  { name: "Store", href: "/shop" },
  { name: "PearPhone", href: "/shop/pearphone" },
  { name: "PearBook", href: "/shop/pearbook" },
  { name: "PearPad", href: "/shop/pearpad" },
  { name: "PearWatch", href: "/shop/pearwatch" },
  { name: "PearPods", href: "/shop/pearpods" },
  { name: "Accessories", href: "/shop/accessories" },
  { name: "Support", href: "/support" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { openCart, totalItems } = useCartStore();
  const itemCount = totalItems();

  // Prevent hydration mismatch by only showing cart count after mount
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-pear flex items-center justify-center">
            <span className="text-lg font-bold text-gray-dark">🍐</span>
          </div>
          <span className="text-xl font-semibold text-gray-dark hidden sm:block">
            Pear
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex lg:items-center lg:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-gray-dark hover:text-pear-dark transition-colors"
            >
              {item.name}
            </Link>
          ))}
          <Link
            href="/support/pear-genius"
            className="inline-flex items-center gap-1.5 bg-pear px-3 py-1 rounded-full text-sm font-semibold text-gray-dark hover:bg-pear-dark transition-colors"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Pear Genius
          </Link>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          <button
            type="button"
            className="p-2 text-gray-dark hover:text-pear-dark transition-colors"
            aria-label="Search"
          >
            <Search className="h-5 w-5" />
          </button>

          <button
            type="button"
            onClick={openCart}
            className="relative p-2 text-gray-dark hover:text-pear-dark transition-colors"
            aria-label="Shopping cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {mounted && itemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-pear text-xs font-medium text-gray-dark flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>

          <Link
            href="/account"
            className="p-2 text-gray-dark hover:text-pear-dark transition-colors"
            aria-label="Account"
          >
            <User className="h-5 w-5" />
          </Link>

          {/* Mobile menu button */}
          <button
            type="button"
            className="lg:hidden p-2 text-gray-dark"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/20 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 right-0 w-full max-w-sm bg-white px-6 py-6 shadow-xl">
            <div className="flex items-center justify-between">
              <Link
                href="/"
                className="flex items-center gap-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                <div className="h-8 w-8 rounded-full bg-pear flex items-center justify-center">
                  <span className="text-lg font-bold">🍐</span>
                </div>
                <span className="text-xl font-semibold">Pear</span>
              </Link>
              <button
                type="button"
                className="p-2 text-gray-dark"
                onClick={() => setMobileMenuOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mt-8 flow-root">
              <div className="space-y-4">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    className="block py-2 text-lg font-medium text-gray-dark hover:text-pear-dark"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                ))}
                <Link
                  href="/support/pear-genius"
                  className="inline-flex items-center gap-2 bg-pear px-4 py-2 rounded-full text-lg font-semibold text-gray-dark"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Sparkles className="h-4 w-4" />
                  Pear Genius
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

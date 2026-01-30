"use client";

import { Button } from "@/components/ui/button";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import Link from "next/link";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, totalPrice } =
    useCartStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm"
        onClick={closeCart}
      />

      {/* Drawer */}
      <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-dark">Your Bag</h2>
          <button
            type="button"
            onClick={closeCart}
            className="p-2 text-gray-medium hover:text-gray-dark transition-colors"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <p className="text-gray-medium mb-4">Your bag is empty</p>
              <Button onClick={closeCart} asChild>
                <Link href="/shop">Start Shopping</Link>
              </Button>
            </div>
          ) : (
            <ul className="space-y-4">
              {items.map((item) => (
                <li
                  key={`${item.productId}-${item.variantId || ""}`}
                  className="flex gap-4 py-4 border-b border-gray-100"
                >
                  <div className="h-20 w-20 flex-shrink-0 rounded-lg bg-gray-light flex items-center justify-center overflow-hidden">
                    <div className="text-3xl">🍐</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-medium text-gray-dark truncate">
                      {item.name}
                    </h3>
                    <p className="text-sm text-gray-medium mt-1">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity - 1,
                            item.variantId
                          )
                        }
                        className="p-1 rounded-full hover:bg-gray-light transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-4 w-4" />
                      </button>
                      <span className="w-8 text-center text-sm">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(
                            item.productId,
                            item.quantity + 1,
                            item.variantId
                          )
                        }
                        className="p-1 rounded-full hover:bg-gray-light transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(item.productId, item.variantId)}
                    className="p-1 text-gray-medium hover:text-red-500 transition-colors"
                    aria-label="Remove item"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 px-6 py-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-base font-medium text-gray-dark">
                Subtotal
              </span>
              <span className="text-base font-semibold text-gray-dark">
                {formatPrice(totalPrice())}
              </span>
            </div>
            <Button className="w-full" size="lg" asChild>
              <Link href="/checkout" onClick={closeCart}>
                Check Out
              </Link>
            </Button>
            <Button
              variant="ghost"
              className="w-full"
              onClick={closeCart}
              asChild
            >
              <Link href="/cart">View Bag</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

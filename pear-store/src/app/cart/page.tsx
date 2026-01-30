"use client";

import { Button } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { useCartStore } from "@/stores/cart-store";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CartPage() {
  const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();

  if (items.length === 0) {
    return (
      <div className="min-h-screen py-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <ShoppingBag className="h-24 w-24 mx-auto text-gray-300 mb-6" />
          <h1 className="text-3xl font-bold text-gray-dark mb-4">
            Your bag is empty.
          </h1>
          <p className="text-gray-medium mb-8">
            Looks like you haven&apos;t added anything to your bag yet.
          </p>
          <Button size="lg" asChild>
            <Link href="/shop">Start Shopping</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-dark mb-8">Your Bag</h1>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="space-y-6">
              {items.map((item) => (
                <div
                  key={`${item.productId}-${item.variantId || ""}`}
                  className="flex gap-6 p-6 bg-white rounded-2xl border border-gray-200"
                >
                  <div className="h-32 w-32 flex-shrink-0 rounded-lg bg-gray-light flex items-center justify-center overflow-hidden">
                    <div className="text-5xl">🍐</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-dark">
                      {item.name}
                    </h3>
                    <p className="text-lg text-gray-dark mt-1">
                      {formatPrice(item.price)}
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1, item.variantId)
                          }
                          className="p-2 rounded-full border border-gray-300 hover:bg-gray-light transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="w-8 text-center font-medium">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity + 1, item.variantId)
                          }
                          className="p-2 rounded-full border border-gray-300 hover:bg-gray-light transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeItem(item.productId, item.variantId)}
                        className="p-2 text-gray-medium hover:text-red-500 transition-colors"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold text-gray-dark">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={clearCart}
              className="mt-6 text-sm text-gray-medium hover:text-red-500 transition-colors"
            >
              Clear bag
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-light rounded-2xl p-6 sticky top-24">
              <h2 className="text-xl font-semibold text-gray-dark mb-6">
                Order Summary
              </h2>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-medium">Subtotal</span>
                  <span className="text-gray-dark">{formatPrice(totalPrice())}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-medium">Shipping</span>
                  <span className="text-gray-dark">
                    {totalPrice() >= 50 ? "Free" : formatPrice(9.99)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-medium">Tax</span>
                  <span className="text-gray-dark">Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-gray-300 mt-6 pt-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span className="text-gray-dark">Estimated Total</span>
                  <span className="text-gray-dark">
                    {formatPrice(totalPrice() + (totalPrice() >= 50 ? 0 : 9.99))}
                  </span>
                </div>
              </div>

              <Button size="lg" className="w-full mt-6" asChild>
                <Link href="/checkout">Check Out</Link>
              </Button>

              <p className="text-xs text-gray-medium text-center mt-4">
                Free delivery on orders over $50
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

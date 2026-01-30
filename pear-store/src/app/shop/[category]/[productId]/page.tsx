"use client";

import { Badge, Button } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { useProduct, getPrice } from "@/lib/hooks/use-products";
import { getProductGallery, getProductEmoji, hasProductImage } from "@/lib/product-images";
import { useCartStore } from "@/stores/cart-store";
import { ChevronLeft, Minus, Plus, ShoppingBag, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { use, useState } from "react";

interface ProductPageProps {
  params: Promise<{ category: string; productId: string }>;
}

export default function ProductPage({ params }: ProductPageProps) {
  const { category, productId } = use(params);
  const { data: product, isLoading } = useProduct(productId);
  const { addItem, openCart } = useCartStore();
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Use product's actual category from API for images (fallback to URL category)
  const productCategory = product?.category || category;
  const gallery = getProductGallery(productCategory);
  const hasImages = hasProductImage(productCategory);
  const emoji = getProductEmoji(productCategory);

  const handleAddToCart = () => {
    if (!product) return;
    const price = getPrice(product);
    addItem(
      {
        productId: product.id,
        name: product.name,
        price: price,
      },
      quantity
    );
    openCart();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            <div className="aspect-square rounded-2xl bg-gray-light animate-pulse" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-gray-light rounded animate-pulse" />
              <div className="h-6 w-1/4 bg-gray-light rounded animate-pulse" />
              <div className="h-24 bg-gray-light rounded animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 text-center">
          <div className="text-6xl mb-4">🍐</div>
          <h1 className="text-2xl font-bold text-gray-dark mb-4">
            Product not found
          </h1>
          <Button asChild>
            <Link href="/shop">Back to Shop</Link>
          </Button>
        </div>
      </div>
    );
  }

  const price = getPrice(product);

  return (
    <div className="min-h-screen">
      {/* Breadcrumb */}
      <div className="bg-gray-light py-4">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Link
            href={productCategory && productCategory !== "products" ? `/shop/${productCategory}` : "/shop"}
            className="inline-flex items-center text-sm text-gray-medium hover:text-gray-dark"
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to {productCategory && productCategory !== "products"
              ? productCategory.charAt(0).toUpperCase() + productCategory.slice(1)
              : "Shop"}
          </Link>
        </div>
      </div>

      {/* Product Details */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Product Images */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="relative aspect-square rounded-2xl bg-gray-light flex items-center justify-center overflow-hidden">
                {hasImages && gallery.length > 0 ? (
                  <Image
                    src={gallery[selectedImageIndex]}
                    alt={product.name}
                    fill
                    className="object-contain p-8"
                    priority
                  />
                ) : (
                  <div className="text-9xl">{emoji}</div>
                )}
                {product.status === "coming_soon" && (
                  <Badge className="absolute top-4 left-4" variant="secondary">
                    Coming Soon
                  </Badge>
                )}
              </div>

              {/* Thumbnail Gallery */}
              {hasImages && gallery.length > 1 && (
                <div className="flex gap-4 justify-center">
                  {gallery.map((image, index) => (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setSelectedImageIndex(index)}
                      className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                        selectedImageIndex === index
                          ? "border-pear"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.name} view ${index + 1}`}
                        fill
                        className="object-contain p-2 bg-gray-light"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-dark">
                {product.name}
              </h1>

              {product.rating && (
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex items-center text-yellow-500">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.round(product.rating!.average)
                            ? "fill-current"
                            : "stroke-current fill-none"
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-medium">
                    {product.rating.average.toFixed(1)} ({product.rating.count} reviews)
                  </span>
                </div>
              )}

              <p className="text-2xl font-semibold text-gray-dark mt-4">
                {formatPrice(price)}
              </p>

              {product.description && (
                <p className="text-gray-medium mt-4 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Quantity Selector */}
              {product.status === "active" && (
                <div className="mt-8">
                  <label className="text-sm font-medium text-gray-dark">
                    Quantity
                  </label>
                  <div className="flex items-center gap-4 mt-2">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 rounded-full border border-gray-300 hover:bg-gray-light transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="w-8 text-center font-medium">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 rounded-full border border-gray-300 hover:bg-gray-light transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Add to Cart */}
              <div className="mt-8 space-y-4">
                {product.status === "active" ? (
                  <Button size="lg" className="w-full" onClick={handleAddToCart}>
                    <ShoppingBag className="h-5 w-5 mr-2" />
                    Add to Bag - {formatPrice(price * quantity)}
                  </Button>
                ) : product.status === "coming_soon" ? (
                  <Button size="lg" className="w-full" variant="secondary" disabled>
                    Coming Soon
                  </Button>
                ) : (
                  <Button size="lg" className="w-full" variant="secondary" disabled>
                    Out of Stock
                  </Button>
                )}
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {product.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

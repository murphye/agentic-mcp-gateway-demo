"use client";

import { Badge, Button, Card } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { type Product, getPrice } from "@/lib/hooks/use-products";
import { getProductImage, getProductEmoji } from "@/lib/product-images";
import { useCartStore } from "@/stores/cart-store";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
  categorySlug?: string;
}

export function ProductCard({ product, categorySlug }: ProductCardProps) {
  const { addItem, openCart } = useCartStore();
  const price = getPrice(product);
  // Use provided categorySlug, or product's category, or fallback to "products"
  const category = categorySlug || product.category || "products";
  const productImage = getProductImage(product.category);
  const productEmoji = getProductEmoji(product.category);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem({
      productId: product.id,
      name: product.name,
      price: price,
    });
    openCart();
  };

  return (
    <Link href={`/shop/${category}/${product.id}`}>
      <Card className="group h-full overflow-hidden transition-shadow hover:shadow-lg">
        {/* Product Image */}
        <div className="relative aspect-square bg-gray-light flex items-center justify-center overflow-hidden">
          {productImage ? (
            <Image
              src={productImage}
              alt={product.name}
              fill
              className="object-contain p-4 group-hover:scale-105 transition-transform"
            />
          ) : (
            <div className="text-6xl group-hover:scale-110 transition-transform">
              {productEmoji}
            </div>
          )}
          {product.status === "coming_soon" && (
            <Badge className="absolute top-4 left-4" variant="secondary">
              Coming Soon
            </Badge>
          )}
          {product.status === "out_of_stock" && (
            <Badge className="absolute top-4 left-4" variant="error">
              Out of Stock
            </Badge>
          )}
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-2">
          <h3 className="font-semibold text-gray-dark line-clamp-2 group-hover:text-pear-dark transition-colors">
            {product.name}
          </h3>
          {product.shortDescription && (
            <p className="text-sm text-gray-medium line-clamp-2">
              {product.shortDescription}
            </p>
          )}
          <div className="flex items-center justify-between pt-2">
            <span className="text-lg font-semibold text-gray-dark">
              {formatPrice(price)}
            </span>
            {product.rating && (
              <span className="text-sm text-gray-medium">
                ★ {product.rating.average.toFixed(1)} ({product.rating.count})
              </span>
            )}
          </div>
          {product.status === "active" && (
            <Button
              variant="outline"
              size="sm"
              className="w-full mt-2 opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleAddToCart}
            >
              <ShoppingBag className="h-4 w-4 mr-2" />
              Add to Bag
            </Button>
          )}
        </div>
      </Card>
    </Link>
  );
}

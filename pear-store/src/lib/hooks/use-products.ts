"use client";

import { useQuery } from "@tanstack/react-query";
import { apiClient, API_PATHS } from "../api/client";

// Types based on the product-catalog OpenAPI spec
export interface ProductImage {
  url: string;
  alt?: string;
  type?: "hero" | "thumbnail" | "gallery";
}

export interface Product {
  id: string;
  name: string;
  description?: string;
  shortDescription?: string;
  basePrice: { amount: number; currency: string };
  category?: string;
  categoryId?: string;
  status: "active" | "discontinued" | "coming_soon" | "out_of_stock";
  images?: ProductImage[];
  tags?: string[];
  rating?: { average: number; count: number };
  specifications?: Record<string, unknown>;
}

// Helper to get the primary/hero image
export function getPrimaryImage(product: Product): ProductImage | undefined {
  return product.images?.find((img) => img.type === "hero") || product.images?.[0];
}

// Helper to get price as number
export function getPrice(product: Product): number {
  return product.basePrice?.amount ?? 0;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  slug?: string;
  parentId?: string;
}

export interface ProductsResponse {
  products: Product[];
  pagination?: {
    page: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface CategoriesResponse {
  categories: Category[];
}

// Fetch all products
export function useProducts(params?: {
  category?: string;
  status?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["products", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.category) searchParams.set("category", params.category);
      if (params?.status) searchParams.set("status", params.status);
      if (params?.search) searchParams.set("search", params.search);
      if (params?.page) searchParams.set("page", params.page.toString());
      // API uses 'limit' not 'pageSize'
      if (params?.limit) searchParams.set("limit", params.limit.toString());
      if (params?.pageSize) searchParams.set("limit", params.pageSize.toString());

      const queryString = searchParams.toString();
      const url = `${API_PATHS.productCatalog}/products${queryString ? `?${queryString}` : ""}`;

      const response = await apiClient.get<ProductsResponse>({
        url,
      });

      if (response.error) {
        throw new Error("Failed to fetch products");
      }

      return response.data;
    },
  });
}

// Fetch single product by ID
export function useProduct(productId: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      const response = await apiClient.get<Product>({
        url: `${API_PATHS.productCatalog}/products/${productId}`,
      });

      if (response.error) {
        throw new Error("Failed to fetch product");
      }

      return response.data;
    },
    enabled: !!productId,
  });
}

// Fetch all categories
export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await apiClient.get<CategoriesResponse>({
        url: `${API_PATHS.productCatalog}/categories`,
      });

      if (response.error) {
        throw new Error("Failed to fetch categories");
      }

      return response.data;
    },
  });
}

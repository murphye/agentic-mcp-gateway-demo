"use client";

import { useQuery } from "@tanstack/react-query";

const API_BASE = "http://localhost:3000/v1/product-support";

// Types based on product-support OpenAPI spec
export type DeviceType = "pphone" | "pearbook" | "pearpad" | "pear_watch" | "pearpods" | "peartv" | "accessories";

export interface SupportArticle {
  id: string;
  title: string;
  slug?: string;
  summary?: string;
  content?: string;
  category: string;
  topics?: string[];
  deviceTypes?: DeviceType[];
  productIds?: string[];
  tags?: string[];
  viewCount?: number;
  helpfulCount?: number;
  createdAt?: string;
  updatedAt?: string;
  // Nested metadata from API
  metadata?: {
    views?: number;
    helpfulVotes?: number;
    notHelpfulVotes?: number;
    lastUpdated?: string;
    publishedAt?: string;
    author?: string;
    locale?: string;
  };
  // Also support snake_case for compatibility
  device_types?: DeviceType[];
  view_count?: number;
  updated_at?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  shortAnswer?: string;
  category?: string;
  deviceTypes?: DeviceType[];
  topics?: string[];
  order?: number;
  // Also support snake_case for compatibility
  device_types?: DeviceType[];
}

export interface WarrantyCoverage {
  serial_number: string;
  product_name: string;
  device_type: DeviceType;
  purchase_date: string;
  warranty_end_date: string;
  is_covered: boolean;
  coverage_type: "standard" | "extended" | "applecare_plus";
  days_remaining?: number;
  coverage_details?: {
    hardware_coverage: boolean;
    accidental_damage: boolean;
    battery_service: boolean;
    software_support: boolean;
  };
}

export interface RepairOption {
  id: string;
  name: string;
  description: string;
  type: "mail_in" | "carry_in" | "onsite" | "self_service";
  estimated_duration: string;
  estimated_cost?: {
    min: number;
    max: number;
    currency: string;
  };
  available: boolean;
}

export interface SoftwareUpdate {
  id: string;
  name: string;
  version: string;
  device_types: DeviceType[];
  release_date: string;
  description?: string;
  features?: string[];
  size_mb?: number;
  download_url?: string;
  is_critical?: boolean;
}

export interface SearchResult {
  type: "article" | "faq" | "software_update";
  id: string;
  title: string;
  summary?: string;
  relevance_score: number;
}

// Helper to normalize API responses that may return array directly or wrapped
// API often returns 'items' instead of the expected key, so we check both
function normalizeArrayResponse<T>(data: T[] | { [key: string]: T[] | unknown }, key: string): T[] {
  if (Array.isArray(data)) return data;
  if (data && typeof data === 'object') {
    // First check for 'items' (common API pattern)
    if ('items' in data) {
      const value = (data as Record<string, unknown>)['items'];
      if (Array.isArray(value)) return value as T[];
    }
    // Then check for the expected key
    if (key in data) {
      const value = (data as Record<string, unknown>)[key];
      if (Array.isArray(value)) return value as T[];
    }
  }
  return [];
}

// Hooks
export function useArticles(params?: {
  device_type?: DeviceType;
  category?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["product-support", "articles", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.device_type) searchParams.set("device_type", params.device_type);
      if (params?.category) searchParams.set("category", params.category);
      if (params?.limit) searchParams.set("limit", params.limit.toString());

      const url = `${API_BASE}/articles${searchParams.toString() ? `?${searchParams}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch articles");
      const data = await res.json();
      const articles = normalizeArrayResponse<SupportArticle>(data, 'articles');
      return { articles, total: articles.length };
    },
  });
}

export function useArticle(articleId: string) {
  return useQuery({
    queryKey: ["product-support", "article", articleId],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/articles/${articleId}`);
      if (!res.ok) throw new Error("Failed to fetch article");
      return res.json() as Promise<SupportArticle>;
    },
    enabled: !!articleId,
  });
}

export function useFAQs(params?: {
  device_type?: DeviceType;
  topic?: string;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["product-support", "faqs", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.device_type) searchParams.set("device_type", params.device_type);
      if (params?.topic) searchParams.set("topic", params.topic);
      if (params?.limit) searchParams.set("limit", params.limit.toString());

      const url = `${API_BASE}/faqs${searchParams.toString() ? `?${searchParams}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch FAQs");
      const data = await res.json();
      const faqs = normalizeArrayResponse<FAQ>(data, 'faqs');
      return { faqs, total: data.total || faqs.length };
    },
  });
}

export function useWarrantyCoverage(serialNumber: string) {
  return useQuery({
    queryKey: ["product-support", "warranty", serialNumber],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/warranty/coverage?serial_number=${encodeURIComponent(serialNumber)}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error("Failed to check warranty");
      }
      return res.json() as Promise<WarrantyCoverage>;
    },
    enabled: !!serialNumber,
  });
}

export function useRepairOptions(params?: {
  device_type?: DeviceType;
  issue_type?: string;
}) {
  return useQuery({
    queryKey: ["product-support", "repairs", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.device_type) searchParams.set("device_type", params.device_type);
      if (params?.issue_type) searchParams.set("issue_type", params.issue_type);

      const url = `${API_BASE}/repairs/options${searchParams.toString() ? `?${searchParams}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch repair options");
      const data = await res.json();
      const options = normalizeArrayResponse<RepairOption>(data, 'options');
      return { options };
    },
  });
}

export function useSoftwareUpdates(params?: {
  device_type?: DeviceType;
  limit?: number;
}) {
  return useQuery({
    queryKey: ["product-support", "software-updates", params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params?.device_type) searchParams.set("device_type", params.device_type);
      if (params?.limit) searchParams.set("limit", params.limit.toString());

      const url = `${API_BASE}/software/updates${searchParams.toString() ? `?${searchParams}` : ""}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch software updates");
      const data = await res.json();
      const updates = normalizeArrayResponse<SoftwareUpdate>(data, 'updates');
      return { updates, total: updates.length };
    },
  });
}

export function useSupportSearch(query: string) {
  return useQuery({
    queryKey: ["product-support", "search", query],
    queryFn: async () => {
      const res = await fetch(`${API_BASE}/search?q=${encodeURIComponent(query)}`);
      if (!res.ok) throw new Error("Failed to search");
      const data = await res.json();
      const results = normalizeArrayResponse<SearchResult>(data, 'results');
      return { results, total: results.length };
    },
    enabled: query.length >= 2,
  });
}

// Device type display info
export const deviceTypeInfo: Record<DeviceType, { name: string; emoji: string; description: string }> = {
  pphone: {
    name: "PearPhone",
    emoji: "📱",
    description: "Get help with your PearPhone",
  },
  pearbook: {
    name: "PearBook",
    emoji: "💻",
    description: "Get help with your PearBook",
  },
  pearpad: {
    name: "PearPad",
    emoji: "📱",
    description: "Get help with your PearPad",
  },
  pear_watch: {
    name: "PearWatch",
    emoji: "⌚",
    description: "Get help with your PearWatch",
  },
  pearpods: {
    name: "PearPods",
    emoji: "🎧",
    description: "Get help with your PearPods",
  },
  peartv: {
    name: "PearTV",
    emoji: "📺",
    description: "Get help with your PearTV",
  },
  accessories: {
    name: "Accessories",
    emoji: "🔌",
    description: "Get help with Pear accessories",
  },
};

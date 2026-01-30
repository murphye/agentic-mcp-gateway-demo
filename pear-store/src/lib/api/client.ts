import { createClient } from "@hey-api/client-fetch";

// API Gateway base URL - all services are routed through agentgateway
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

// Create a shared client instance for all services
export const apiClient = createClient({
  baseUrl: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Service-specific base paths (for reference)
export const API_PATHS = {
  productCatalog: "/v1/product-catalog",
  inventory: "/v1/inventory",
  onlineStore: "/v1/online-store",
  shipping: "/v1/shipping",
  physicalStores: "/v1/physical-stores",
  productSupport: "/v1/product-support",
  payments: "/v1/payments",
  orderManagement: "/v1/order-management",
  customerAccounts: "/v1/customer-accounts",
  customerSupport: "/v1/customer-support",
  analytics: "/v1/analytics",
} as const;

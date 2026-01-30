import { defineConfig } from "@hey-api/openapi-ts";

// Services to generate clients for
const services = [
  { name: "product-catalog", port: 8080 },
  { name: "inventory", port: 8081 },
  { name: "online-store", port: 8082 },
  { name: "shipping", port: 8083 },
  { name: "physical-stores", port: 8084 },
  { name: "product-support", port: 8085 },
  { name: "payments", port: 8086 },
  { name: "order-management", port: 8087 },
  { name: "customer-accounts", port: 8088 },
  { name: "customer-support", port: 8089 },
  { name: "analytics", port: 8090 },
];

// Default export for single service generation
// Run with: npx openapi-ts -c openapi-ts.config.ts
export default defineConfig({
  input: "../services/product-catalog/server/api/openapi.yaml",
  output: {
    path: "src/lib/api/product-catalog",
    format: "prettier",
  },
  plugins: [
    "@hey-api/client-fetch",
    "@hey-api/sdk",
    {
      name: "@hey-api/schemas",
      type: "json",
    },
    {
      name: "@tanstack/react-query",
      infiniteQueryOptions: false,
    },
  ],
});

// Export services for use in generate script
export { services };

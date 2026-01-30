#!/usr/bin/env node
import { execSync } from "child_process";
import { existsSync, mkdirSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, "..");

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

console.log("Generating API clients from OpenAPI specs...\n");

for (const service of services) {
  const inputPath = join(
    rootDir,
    "..",
    "services",
    service.name,
    "server",
    "api",
    "openapi.yaml"
  );
  const outputPath = join(rootDir, "src", "lib", "api", service.name);

  if (!existsSync(inputPath)) {
    console.log(`⚠️  Skipping ${service.name}: OpenAPI spec not found`);
    continue;
  }

  // Ensure output directory exists
  if (!existsSync(outputPath)) {
    mkdirSync(outputPath, { recursive: true });
  }

  console.log(`📦 Generating ${service.name}...`);

  try {
    execSync(
      `npx @hey-api/openapi-ts -i "${inputPath}" -o "${outputPath}" -c @hey-api/client-fetch -c @hey-api/sdk -c @tanstack/react-query`,
      {
        cwd: rootDir,
        stdio: "pipe",
      }
    );
    console.log(`   ✅ ${service.name} generated`);
  } catch (error) {
    console.error(`   ❌ ${service.name} failed:`, error.message);
  }
}

console.log("\n✨ API client generation complete!");

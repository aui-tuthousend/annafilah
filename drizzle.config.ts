import { defineConfig } from "drizzle-kit";

export default defineConfig({
  dialect: "postgresql",
  schemaFilter: ["public"],
  introspect: {
    casing: "preserve",
  },
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: {
    url: process.env.DATABASE_URL ?? "",
  },
});
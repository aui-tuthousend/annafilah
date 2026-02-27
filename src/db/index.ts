import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

if (!import.meta.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not set. Buat file .env dan isi DATABASE_URL.");
}

// Koneksi ke PostgreSQL via postgres.js
const client = postgres(import.meta.env.DATABASE_URL);

export const db = drizzle(client, { schema });

// Re-export schema agar bisa diimport dari satu tempat
export * from "./schema";

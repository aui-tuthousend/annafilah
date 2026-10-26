// src/db/index.ts
// ─── Koneksi database (Drizzle ORM + postgres.js) ─────────────────────────────
// Connection string tidak dibaca saat module di-load, karena di Cloudflare
// Workers binding Hyperdrive & secret baru tersedia saat request berjalan.
// Instance dibuat saat query pertama (lazy), yaitu setelah middleware
// menyimpan env runtime lewat `setRuntimeEnv()`.

import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import { envValue, getRuntimeEnv } from "../lib/runtime-env";
import * as schema from "./schema";

export type Database = PostgresJsDatabase<typeof schema>;

let instance: Database | undefined;

function resolveConnectionString(): string {
    // `DATABASE_URL` diutamakan supaya `astro dev` lokal cukup memakai `.env`.
    // Di produksi variabel ini tidak diset, sehingga binding Hyperdrive dipakai.
    const hyperdrive = getRuntimeEnv()?.HYPERDRIVE as
        | { connectionString?: string }
        | undefined;

    const url =
        envValue("DATABASE_URL", import.meta.env.DATABASE_URL) ??
        hyperdrive?.connectionString;

    if (!url) {
        throw new Error(
            "DATABASE_URL tidak ditemukan. Set sebagai secret di Cloudflare, atau isi di .env untuk lokal."
        );
    }

    return url;
}

/** Buat instance Drizzle baru. Dipakai sekali per isolate Worker. */
export function createDb(): Database {
    const client = postgres(resolveConnectionString(), {
        // Workers membatasi jumlah koneksi eksternal per request
        max: 1,
        // Hindari round-trip tambahan untuk membaca tipe kolom (disarankan Hyperdrive)
        fetch_types: false,
    });

    return drizzle(client, { schema });
}

export function getDb(): Database {
    if (!instance) instance = createDb();
    return instance;
}

/**
 * `db` sengaja dibungkus Proxy supaya instance-nya baru dibuat pada pemakaian
 * pertama (setelah env runtime tersedia), tanpa mengubah satu pun call site.
 */
export const db = new Proxy({} as Database, {
    get(_target, prop) {
        const real = getDb() as unknown as Record<string | symbol, unknown>;
        const value = real[prop];
        return typeof value === "function" ? value.bind(real) : value;
    },
});

// Re-export schema agar bisa diimport dari satu tempat
export * from "./schema";

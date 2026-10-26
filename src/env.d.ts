// src/env.d.ts
// ─── Deklarasi type untuk Astro.locals (diisi oleh middleware auth) ───────────

/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

// Catatan: sengaja memakai inline `import(...)` (bukan import statement di atas)
// supaya file ini tetap "script", sehingga `declare namespace App` di bawah
// benar-benar meng-augment namespace global milik Astro.

// ─── Binding & secret Cloudflare (lihat wrangler.jsonc) ───────────────────────
interface Env {
    HYPERDRIVE: { connectionString: string };
    DATABASE_URL?: string;
    SESSION_SECRET?: string;

    S3_REGION?: string;
    S3_ENDPOINT?: string;
    S3_ACCESS_KEY?: string;
    S3_SECRET_KEY?: string;
    S3_BUCKET_NAME?: string;
    S3_PUBLIC_URL?: string;
}

declare namespace App {
    interface Locals {
        /** Binding & secret Cloudflare (Hyperdrive, R2, dst) */
        runtime: import("@astrojs/cloudflare").Runtime<Env>["runtime"];
        /** UUID user yang sedang login (diisi oleh middleware) */
        userId?: string;
        /** Username admin yang sedang login */
        username?: string;
        /** Role user: "admin" | dsb */
        role?: string;
    }
}

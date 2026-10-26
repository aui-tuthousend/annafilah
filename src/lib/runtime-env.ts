// src/lib/runtime-env.ts
// ─── Akses environment variable lintas runtime ────────────────────────────────
// Di Cloudflare Workers binding & secret hanya tersedia saat request berjalan,
// jadi nilainya ditangkap oleh middleware (lihat src/middleware.ts) lalu dipakai
// ulang oleh modul non-Astro seperti src/db/index.ts dan src/lib/image.ts.

type EnvRecord = Record<string, unknown>;

let runtimeEnv: EnvRecord | undefined;

/**
 * Simpan env runtime Cloudflare (hasil `Astro.locals.runtime.env`).
 * Aman disimpan di module scope karena env milik satu Worker selalu sama
 * untuk seluruh request yang masuk.
 */
export function setRuntimeEnv(env: unknown): void {
    runtimeEnv = (env ?? undefined) as EnvRecord | undefined;
}

export function getRuntimeEnv(): EnvRecord | undefined {
    return runtimeEnv;
}

/**
 * Ambil environment variable dengan urutan prioritas:
 * 1. runtimeEnv  → binding & secret Cloudflare (produksi), atau `.env` saat `astro dev`
 * 2. process.env → di Workers diisi lewat `nodejs_compat`, atau `.dev.vars` saat `wrangler dev`
 * 3. buildEnv    → nilai yang di-inline Vite dari `.env` saat build
 */
export function envValue(name: string, buildEnv?: string): string | undefined {
    const fromRuntime = runtimeEnv?.[name];
    if (typeof fromRuntime === "string" && fromRuntime !== "") return fromRuntime;

    const fromProcess = typeof process !== "undefined" ? process.env?.[name] : undefined;
    if (typeof fromProcess === "string" && fromProcess !== "") return fromProcess;

    return buildEnv;
}

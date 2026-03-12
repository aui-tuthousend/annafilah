// src/env.d.ts
// ─── Deklarasi type untuk Astro.locals (diisi oleh middleware auth) ───────────

/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />

declare namespace App {
    interface Locals {
        /** UUID user yang sedang login (diisi oleh middleware) */
        userId?: string;
        /** Username admin yang sedang login */
        username?: string;
        /** Role user: "admin" | dsb */
        role?: string;
    }
}

// src/middleware.ts
// ─── Middleware global Astro ───────────────────────────────────────────────────
// Memproteksi semua route /*/create, /*/edit, /*/delete
// dan API endpoint POST/PUT/DELETE agar hanya bisa diakses setelah login.

import { defineMiddleware } from "astro:middleware";
import { validateSession, SESSION_COOKIE } from "./lib/auth";

// ── Path halaman UI yang membutuhkan login ────────────────────────────────────
const PROTECTED_PAGE_PREFIXES = [
    "/berita/create",
    "/berita/edit",
    "/artikel/create",
    "/artikel/edit",
    "/program/create",
    "/program/edit",
    "/admin",
];

// ── API route yang membutuhkan login (method selain GET) ──────────────────────
const PROTECTED_API_PREFIXES = [
    "/api/berita",
    "/api/artikel",
    "/api/program",
];

export const onRequest = defineMiddleware(async (context, next) => {
    const { url, request, cookies, redirect } = context;
    const pathname = url.pathname;
    const method = request.method.toUpperCase();

    // ── Cek apakah halaman ini perlu login ────────────────────────────────────
    const isProtectedPage = PROTECTED_PAGE_PREFIXES.some((p) =>
        pathname.startsWith(p)
    );

    // ── Cek apakah API route ini perlu login (hanya mutasi) ───────────────────
    const isProtectedApi =
        method !== "GET" &&
        PROTECTED_API_PREFIXES.some((p) => pathname.startsWith(p));

    // ── Validasi session dari cookie untuk semua request (Optimal: hanya 1 query per request) ──
    const sessionId = cookies.get(SESSION_COOKIE)?.value;
    const user = await validateSession(sessionId);

    // Simpan ke context.locals untuk dipakai di Layout & Halaman tanpa query ulang
    if (user) {
        context.locals.userId = user.userId;
        context.locals.username = user.username;
        context.locals.role = user.role;
    }

    if (!isProtectedPage && !isProtectedApi) {
        return next(); // bukan route protected → langsung lanjut
    }

    // ── Proteksi Route: Jika butuh login tapi tidak ada user ───────────────────
    if (!user) {
        // Hapus cookie jika ternyata sessionId ada tapi invalid/expired di DB
        if (sessionId) cookies.delete(SESSION_COOKIE, { path: "/" });

        if (isProtectedApi) {
            // API → kembalikan 401 JSON
            return new Response(
                JSON.stringify({ success: false, error: "Unauthorized. Silakan login terlebih dahulu." }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        // Halaman UI → redirect ke /login dengan next parameter
        const next_url = encodeURIComponent(pathname);
        return redirect(`/login?next=${next_url}`);
    }

    // ── User valid → simpan ke context.locals ────────────────────────────────
    context.locals.userId = user.userId;
    context.locals.username = user.username;
    context.locals.role = user.role;

    return next();
});

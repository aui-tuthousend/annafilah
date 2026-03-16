// src/pages/api/auth/logout.ts
// ─── POST /api/auth/logout ─────────────────────────────────────────────────────
// Hapus session dari database dan clear cookie, lalu redirect ke /login.

import type { APIRoute } from "astro";
import { deleteSession, SESSION_COOKIE } from "../../../lib/auth";

export const prerender = false;

export const POST: APIRoute = async ({ cookies, redirect }) => {
    const sessionId = cookies.get(SESSION_COOKIE)?.value;

    if (sessionId) {
        // Hapus session dari database
        await deleteSession(sessionId).catch(() => {
            /* ignore — cookie sudah dihapus */
        });
    }

    // Clear cookie di browser
    cookies.delete(SESSION_COOKIE, { path: "/" });

    return redirect("/");
};

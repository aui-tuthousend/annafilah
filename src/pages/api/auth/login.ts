// src/pages/api/auth/login.ts
// ─── POST /api/auth/login ──────────────────────────────────────────────────────
// Menerima { username, password } dari form login.
// Jika valid → buat session di DB, set cookie, kembalikan 200.
// Jika tidak → kembalikan 401.

import type { APIRoute } from "astro";
import { db } from "../../../db";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { createSession, SESSION_COOKIE, cookieOptions } from "../../../lib/auth";

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies }) => {
    try {
        const body = await request.json().catch(() => null);

        if (!body || typeof body.username !== "string" || typeof body.password !== "string") {
            return new Response(
                JSON.stringify({ success: false, error: "Username dan password wajib diisi." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        const { username, password } = body;

        // Cari user di database
        const [user] = await db
            .select()
            .from(users)
            .where(eq(users.username, username.trim().toLowerCase()))
            .limit(1);

        // Cek user ada dan password cocok
        const passwordMatch = user
            ? await bcrypt.compare(password, user.passwordHash)
            : false;

        if (!user || !passwordMatch) {
            // Intentionally vague untuk keamanan
            return new Response(
                JSON.stringify({ success: false, error: "Username atau password salah." }),
                { status: 401, headers: { "Content-Type": "application/json" } }
            );
        }

        // Buat session baru
        const sessionId = await createSession(user.id);

        // Set cookie session
        cookies.set(SESSION_COOKIE, sessionId, cookieOptions);

        return new Response(
            JSON.stringify({
                success: true,
                user: { username: user.username, role: user.role },
            }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("[POST /api/auth/login]", err);
        return new Response(
            JSON.stringify({ success: false, error: "Terjadi kesalahan server." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

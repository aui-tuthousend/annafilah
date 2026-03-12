// src/pages/api/auth/seed.ts
// ─── POST /api/auth/seed ───────────────────────────────────────────────────────
// Endpoint sementara untuk membuat user admin pertama.
// HAPUS atau DISABLE file ini setelah akun admin sudah dibuat!
//
// Cara pakai:
//   curl -X POST http://localhost:4321/api/auth/seed \
//     -H "Content-Type: application/json" \
//     -d '{"username":"admin","password":"passwordkamu","secret":"annafilah-seed"}'

import type { APIRoute } from "astro";
import { db } from "../../../db";
import { users } from "../../../db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export const prerender = false;

// Ganti secret ini jika ingin lebih aman
const SEED_SECRET = import.meta.env.SESSION_SECRET ?? "annafilah-session-secret-2024-ganti-ini";

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json().catch(() => null);

        if (!body || body.secret !== SEED_SECRET) {
            return new Response(
                JSON.stringify({ success: false, error: "Secret tidak valid." }),
                { status: 403, headers: { "Content-Type": "application/json" } }
            );
        }

        const { username, password } = body;

        if (!username || !password || password.length < 8) {
            return new Response(
                JSON.stringify({ success: false, error: "Username wajib diisi, password minimal 8 karakter." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Cek apakah username sudah ada
        const [existing] = await db
            .select({ id: users.id })
            .from(users)
            .where(eq(users.username, username.trim().toLowerCase()))
            .limit(1);

        if (existing) {
            return new Response(
                JSON.stringify({ success: false, error: "Username sudah terdaftar." }),
                { status: 409, headers: { "Content-Type": "application/json" } }
            );
        }

        // Hash password
        const passwordHash = await bcrypt.hash(password, 12);

        // Simpan user ke database
        const [newUser] = await db
            .insert(users)
            .values({
                username: username.trim().toLowerCase(),
                passwordHash,
                role: "admin",
            })
            .returning({ id: users.id, username: users.username, role: users.role });

        return new Response(
            JSON.stringify({
                success: true,
                message: "User admin berhasil dibuat. Hapus endpoint /api/auth/seed setelah ini!",
                user: newUser,
            }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("[POST /api/auth/seed]", err);
        return new Response(
            JSON.stringify({ success: false, error: "Gagal membuat user." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

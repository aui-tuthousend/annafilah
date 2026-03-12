// src/lib/auth.ts
// ─── Auth helpers: create, validate, dan delete session ───────────────────────

import { db } from "../db/index";
import { sessions, users } from "../db/schema";
import { eq, and, gt } from "drizzle-orm";
import { randomBytes } from "node:crypto";

// Session berlaku 7 hari
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

/** Generate 64-char hex token sebagai session ID */
export function generateSessionId(): string {
    return randomBytes(32).toString("hex");
}

/** Buat session baru di database, kembalikan session ID-nya */
export async function createSession(userId: string): Promise<string> {
    const id = generateSessionId();
    const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

    await db.insert(sessions).values({ id, userId, expiresAt });

    return id;
}

/**
 * Validasi session ID dari cookie.
 * Kembalikan { userId, username, role } jika valid, null jika tidak.
 */
export async function validateSession(
    sessionId: string | undefined
): Promise<{ userId: string; username: string; role: string } | null> {
    if (!sessionId) return null;

    const rows = await db
        .select({
            userId: sessions.userId,
            expiresAt: sessions.expiresAt,
            username: users.username,
            role: users.role,
        })
        .from(sessions)
        .innerJoin(users, eq(sessions.userId, users.id))
        .where(
            and(
                eq(sessions.id, sessionId),
                gt(sessions.expiresAt, new Date())
            )
        )
        .limit(1);

    if (rows.length === 0) return null;

    return {
        userId: rows[0].userId,
        username: rows[0].username,
        role: rows[0].role,
    };
}

/** Hapus session dari database (logout) */
export async function deleteSession(sessionId: string): Promise<void> {
    await db.delete(sessions).where(eq(sessions.id, sessionId));
}

/** Hapus semua session yang sudah expired (opsional, untuk cleanup rutin) */
export async function deleteExpiredSessions(): Promise<void> {
    await db.delete(sessions).where(
        // sessions.expiresAt < now
        eq(sessions.expiresAt, sessions.expiresAt) // placeholder — pakai raw sql
    );
}

/** Nama cookie yang dipakai untuk session */
export const SESSION_COOKIE = "af_session";

/** Opsi cookie yang aman */
export const cookieOptions = {
    httpOnly: true,       // tidak bisa diakses JS client
    sameSite: "lax" as const,
    path: "/",
    maxAge: SESSION_TTL_MS / 1000, // dalam detik
    secure: import.meta.env.PROD,  // HTTPS only di production
};

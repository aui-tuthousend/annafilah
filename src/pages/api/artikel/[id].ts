// src/pages/api/artikel/[id].ts
// ─── GET    /api/artikel/:id  → single article detail
// ─── PUT    /api/artikel/:id  → update article
// ─── DELETE /api/artikel/:id  → delete article
import type { APIRoute } from "astro";
import {
    getArticleById,
    updateArticle,
    deleteArticle,
    togglePublish,
} from "../../artikel/-api/repository";
import type { UpdateArticleDto } from "../../artikel/-api/types";

export const prerender = false;

// ─── GET: Article detail ─────────────────────────────────────────────────────
export const GET: APIRoute = async ({ params }) => {
    const id = params.id;
    if (!id) {
        return new Response(
            JSON.stringify({ success: false, error: "ID tidak valid." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const data = await getArticleById(id);
        if (!data) {
            return new Response(
                JSON.stringify({ success: false, error: "Artikel tidak ditemukan." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, data }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("[GET /api/artikel/:id]", err);
        return new Response(
            JSON.stringify({ success: false, error: "Gagal mengambil artikel." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

// ─── PUT: Update article ───────────────────────────────────────────────────────
export const PUT: APIRoute = async ({ params, request }) => {
    const id = params.id;
    if (!id) {
        return new Response(
            JSON.stringify({ success: false, error: "ID tidak valid." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const body = (await request.json()) as UpdateArticleDto;

        if (Object.keys(body).length === 0) {
            return new Response(
                JSON.stringify({ success: false, error: "Tidak ada data yang diperbarui." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Shortcut for publishing toggle
        if ("isPublished" in body && Object.keys(body).length === 1) {
            const data = await togglePublish(id, Boolean(body.isPublished));
            if (!data) {
                return new Response(
                    JSON.stringify({ success: false, error: "Artikel tidak ditemukan." }),
                    { status: 404, headers: { "Content-Type": "application/json" } }
                );
            }
            return new Response(
                JSON.stringify({
                    success: true,
                    data,
                    message: `Artikel berhasil di-${data.isPublished ? "publish" : "unpublish"}.`
                }),
                { status: 200, headers: { "Content-Type": "application/json" } }
            );
        }

        const data = await updateArticle(id, body);
        if (!data) {
            return new Response(
                JSON.stringify({ success: false, error: "Artikel tidak ditemukan." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, data, message: "Artikel berhasil diperbarui." }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err: any) {
        if (err?.code === "23505") {
            return new Response(
                JSON.stringify({ success: false, error: "Slug sudah digunakan." }),
                { status: 409, headers: { "Content-Type": "application/json" } }
            );
        }
        console.error("[PUT /api/artikel/:id]", err);
        return new Response(
            JSON.stringify({ success: false, error: "Gagal memperbarui artikel." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

// ─── DELETE: Delete article ───────────────────────────────────────────────────
export const DELETE: APIRoute = async ({ params }) => {
    const id = params.id;
    if (!id) {
        return new Response(
            JSON.stringify({ success: false, error: "ID tidak valid." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const deleted = await deleteArticle(id);
        if (!deleted) {
            return new Response(
                JSON.stringify({ success: false, error: "Artikel tidak ditemukan." }),
                { status: 404, headers: { "Content-Type": "application/json" } }
            );
        }

        return new Response(
            JSON.stringify({ success: true, message: "Artikel berhasil dihapus." }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("[DELETE /api/artikel/:id]", err);
        return new Response(
            JSON.stringify({ success: false, error: "Gagal menghapus artikel." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

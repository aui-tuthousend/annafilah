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

// ─── PUT: Update article (JSON or FormData) ───────────────────────────────────
export const PUT: APIRoute = async ({ params, request }) => {
    const id = params.id;
    if (!id) {
        return new Response(
            JSON.stringify({ success: false, error: "ID tidak valid." }),
            { status: 400, headers: { "Content-Type": "application/json" } }
        );
    }

    try {
        const contentType = request.headers.get("Content-Type") || "";
        let body: UpdateArticleDto = {};

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            body = {
                slug: (formData.get("slug") as string)?.trim() || undefined,
                title: (formData.get("title") as string)?.trim() || undefined,
                excerpt: (formData.get("excerpt") as string)?.trim() || undefined,
                content: (formData.get("content") as string)?.trim() || undefined,
                category: (formData.get("category") as string)?.trim() || undefined,
                author: (formData.get("author") as string)?.trim() || undefined,
                readingTime: (formData.get("readingTime") as string)?.trim() || undefined,
                isPublished: formData.has("isPublished") ? formData.get("isPublished") === "true" : undefined,
            };

            const rawTags = formData.get("tags") as string;
            if (rawTags) {
                try {
                    body.tags = JSON.parse(rawTags);
                } catch { /* ignored */ }
            }

            // Image update?
            const imageFile = formData.get("image") as File | null;
            if (imageFile && imageFile.size > 0 && imageFile.type.startsWith("image/")) {
                const finalSlug = body.slug || (await getArticleById(id))?.slug;
                if (finalSlug) {
                    const { saveAsWebP } = await import("../../../lib/image");
                    const path = await import("node:path");
                    const uploadsDir = path.join(process.cwd(), "public", "uploads", "artikel");
                    body.image = await saveAsWebP(imageFile, uploadsDir, finalSlug);
                }
            }
        } else {
            body = (await request.json()) as UpdateArticleDto;
        }

        if (Object.keys(body).length === 0) {
            return new Response(
                JSON.stringify({ success: false, error: "Tidak ada data yang diperbarui." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
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

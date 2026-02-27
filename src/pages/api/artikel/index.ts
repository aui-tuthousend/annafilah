// src/pages/api/artikel/index.ts
// ─── GET /api/artikel  → list all articles
// ─── POST /api/artikel → create new article
import type { APIRoute } from "astro";
import { getAllArticles, createArticle } from "../../artikel/-api/repository";
import type { CreateArticleDto, ListArticleQuery } from "../../artikel/-api/types";

export const prerender = false;

// ─── GET: List articles ───────────────────────────────────────────────────────
export const GET: APIRoute = async ({ url }) => {
    try {
        const query: ListArticleQuery = {
            category: url.searchParams.get("category") ?? undefined,
            isPublished: url.searchParams.get("published") !== "false",
            limit: Number(url.searchParams.get("limit") ?? 50),
            offset: Number(url.searchParams.get("offset") ?? 0),
        };

        const data = await getAllArticles(query);

        return new Response(
            JSON.stringify({ success: true, data, total: data.length }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("[GET /api/artikel]", err);
        return new Response(
            JSON.stringify({ success: false, error: "Gagal mengambil data artikel." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

// ─── POST: Create article ─────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request }) => {
    try {
        const body = (await request.json()) as Partial<CreateArticleDto>;

        // Validasi field wajib
        const required = ["slug", "title", "excerpt", "content", "category", "author", "readingTime", "image"] as const;
        for (const field of required) {
            if (!body[field]?.trim()) {
                return new Response(
                    JSON.stringify({ success: false, error: `Field '${field}' wajib diisi.` }),
                    { status: 400, headers: { "Content-Type": "application/json" } }
                );
            }
        }

        const data = await createArticle(body as CreateArticleDto);

        return new Response(
            JSON.stringify({ success: true, data, message: "Artikel berhasil dibuat." }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (err: any) {
        if (err?.code === "23505") {
            return new Response(
                JSON.stringify({ success: false, error: "Slug sudah digunakan." }),
                { status: 409, headers: { "Content-Type": "application/json" } }
            );
        }
        console.error("[POST /api/artikel]", err);
        return new Response(
            JSON.stringify({ success: false, error: "Gagal membuat artikel." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

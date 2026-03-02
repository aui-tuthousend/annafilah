// src/pages/api/artikel/index.ts
// ─── GET /api/artikel  → list all articles
// ─── POST /api/artikel → create new article (multipart/form-data)
import type { APIRoute } from "astro";
import { getAllArticles, createArticle } from "../../artikel/-api/repository";
import type { ListArticleQuery } from "../../artikel/-api/types";
import { saveAsWebP } from "../../../lib/image";
import path from "node:path";

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
        const formData = await request.formData();

        const slug = (formData.get("slug") as string)?.trim();
        const title = (formData.get("title") as string)?.trim();
        const excerpt = (formData.get("excerpt") as string)?.trim();
        const content = (formData.get("content") as string)?.trim();
        const category = (formData.get("category") as string)?.trim();
        const author = (formData.get("author") as string)?.trim();
        const readingTime = (formData.get("readingTime") as string)?.trim();
        const isPublished = formData.get("isPublished") === "true";

        // Tags: dikirim sebagai JSON string array, misal '["SEO","Tips"]'
        let tags: string[] = [];
        try {
            const rawTags = (formData.get("tags") as string)?.trim();
            if (rawTags) tags = JSON.parse(rawTags);
        } catch { /* ignored */ }

        // Thumbnail image file
        const imageFile = formData.get("image") as File | null;
        const validImage = imageFile && imageFile.size > 0 && imageFile.type.startsWith("image/")
            ? imageFile : null;

        // Validation
        if (!slug || !title || !excerpt || !content || !category || !author || !readingTime) {
            return new Response(
                JSON.stringify({ success: false, error: "Semua field wajib diisi." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
        if (!validImage) {
            return new Response(
                JSON.stringify({ success: false, error: "Gambar thumbnail artikel wajib diupload." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Save thumbnail as WebP → public/uploads/artikel/{slug}.webp
        const uploadsDir = path.join(process.cwd(), "public", "uploads", "artikel");
        const imageUrl = await saveAsWebP(validImage, uploadsDir, slug);

        const data = await createArticle({
            slug, title, excerpt, content, category, author,
            readingTime, tags, image: imageUrl, isPublished,
        });

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

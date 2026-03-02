// src/pages/api/berita/index.ts
// ─── GET /api/berita  → list all news
// ─── POST /api/berita → create new news (multipart/form-data, multiple images)
import type { APIRoute } from "astro";
import { getAllNews, createNews, addNewsImages } from "../../berita/-api/repository";
import type { ListNewsQuery } from "../../berita/-api/types";
import { saveAsWebP } from "../../../lib/image";
import path from "node:path";

export const prerender = false;

// ─── GET: List news ───────────────────────────────────────────────────────────
export const GET: APIRoute = async ({ url }) => {
    try {
        const query: ListNewsQuery = {
            category: url.searchParams.get("category") ?? undefined,
            programId: url.searchParams.get("programId") ?? undefined,
            isPublished: url.searchParams.get("published") !== "false",
            limit: Number(url.searchParams.get("limit") ?? 50),
            offset: Number(url.searchParams.get("offset") ?? 0),
        };
        const data = await getAllNews(query);
        return new Response(
            JSON.stringify({ success: true, data, total: data.length }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("[GET /api/berita]", err);
        return new Response(
            JSON.stringify({ success: false, error: "Gagal mengambil data berita." }),
            { status: 500 }
        );
    }
};

// ─── POST: Create news ────────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();

        const slug = (formData.get("slug") as string)?.trim();
        const title = (formData.get("title") as string)?.trim();
        const excerpt = (formData.get("excerpt") as string)?.trim();
        const content = (formData.get("content") as string)?.trim();
        const category = (formData.get("category") as string)?.trim();
        const author = (formData.get("author") as string)?.trim();
        const location = (formData.get("location") as string)?.trim();
        const isPublished = formData.get("isPublished") === "true";
        const programId = (formData.get("programId") as string)?.trim() || null;

        // Collect all uploaded images (multiple)
        const imageFiles = formData.getAll("images") as File[];
        const validImages = imageFiles.filter(f => f && f.size > 0 && f.type.startsWith("image/"));

        // Validation
        if (!slug || !title || !excerpt || !content || !category || !author || !location) {
            return new Response(
                JSON.stringify({ success: false, error: "Semua field wajib diisi." }),
                { status: 400 }
            );
        }
        if (validImages.length === 0) {
            return new Response(
                JSON.stringify({ success: false, error: "Minimal satu gambar wajib diupload." }),
                { status: 400 }
            );
        }

        // Save images as WebP → public/uploads/news/{slug}/
        // cover.webp = first image, image-2.webp, image-3.webp, ...
        const newsDir = path.join(process.cwd(), "public", "uploads", "news", slug);
        const savedUrls: string[] = [];

        for (let i = 0; i < validImages.length; i++) {
            const filename = i === 0 ? "cover" : `image-${i + 1}`;
            const url = await saveAsWebP(validImages[i], newsDir, filename);
            savedUrls.push(url);
        }

        // First image = cover stored in news.image
        const coverImage = savedUrls[0];

        const data = await createNews({
            slug, title, excerpt, content, category, author, location,
            image: coverImage, programId, isPublished,
        });

        // Record all images (urls) including cover to news_images table
        await addNewsImages(data.id, savedUrls);

        return new Response(
            JSON.stringify({ success: true, data, images: savedUrls, message: "Berita berhasil dibuat." }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (err: any) {
        if (err?.code === "23505") {
            return new Response(
                JSON.stringify({ success: false, error: "Slug sudah digunakan." }),
                { status: 409 }
            );
        }
        console.error("[POST /api/berita]", err);
        return new Response(
            JSON.stringify({ success: false, error: "Gagal membuat berita." }),
            { status: 500 }
        );
    }
};

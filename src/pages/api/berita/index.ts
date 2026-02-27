// src/pages/api/berita/index.ts
import type { APIRoute } from "astro";
import { getAllNews, createNews } from "../../berita/-api/repository";
import type { CreateNewsDto, ListNewsQuery } from "../../berita/-api/types";

export const prerender = false;

export const GET: APIRoute = async ({ url }) => {
    try {
        const query: ListNewsQuery = {
            category: url.searchParams.get("category") ?? undefined,
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
        return new Response(JSON.stringify({ success: false, error: "Gagal mengambil data berita." }), { status: 500 });
    }
};

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = (await request.json()) as Partial<CreateNewsDto>;
        const required = ["slug", "title", "excerpt", "content", "category", "author", "image"] as const;
        for (const field of required) {
            if (!body[field]?.trim()) {
                return new Response(JSON.stringify({ success: false, error: `Field '${field}' wajib diisi.` }), { status: 400 });
            }
        }
        const data = await createNews(body as CreateNewsDto);
        return new Response(JSON.stringify({ success: true, data, message: "Berita berhasil dibuat." }), { status: 201 });
    } catch (err: any) {
        if (err?.code === "23505") return new Response(JSON.stringify({ success: false, error: "Slug sudah digunakan." }), { status: 409 });
        return new Response(JSON.stringify({ success: false, error: "Gagal membuat berita." }), { status: 500 });
    }
};

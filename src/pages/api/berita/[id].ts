// src/pages/api/berita/[id].ts
import type { APIRoute } from "astro";
import { getNewsById, updateNews, deleteNews } from "../../berita/-api/repository";
import type { UpdateNewsDto } from "../../berita/-api/types";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ success: false, error: "ID tidak valid." }), { status: 400 });

    try {
        const data = await getNewsById(id);
        if (!data) return new Response(JSON.stringify({ success: false, error: "Berita tidak ditemukan." }), { status: 404 });
        return new Response(JSON.stringify({ success: true, data }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: "Gagal mengambil berita." }), { status: 500 });
    }
};

export const PUT: APIRoute = async ({ params, request }) => {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ success: false, error: "ID tidak valid." }), { status: 400 });

    try {
        const contentType = request.headers.get("Content-Type") || "";
        let body: UpdateNewsDto = {};

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            body = {
                slug: (formData.get("slug") as string)?.trim() || undefined,
                title: (formData.get("title") as string)?.trim() || undefined,
                excerpt: (formData.get("excerpt") as string)?.trim() || undefined,
                content: (formData.get("content") as string)?.trim() || undefined,
                category: (formData.get("category") as string)?.trim() || undefined,
                author: (formData.get("author") as string)?.trim() || undefined,
                location: (formData.get("location") as string)?.trim() || undefined,
                isPublished: formData.has("isPublished") ? formData.get("isPublished") === "true" : undefined,
                programId: formData.has("programId") ? (formData.get("programId") as string)?.trim() || null : undefined,
            };

            // Handle Image Upload during edit
            const imageFile = formData.get("images") as File | null; // Note: Create used "images" multiple, we just handle one cover for now in edit or multiple if needed
            if (imageFile && imageFile.size > 0 && imageFile.type.startsWith("image/")) {
                const finalSlug = body.slug || (await getNewsById(id))?.slug;
                if (finalSlug) {
                    const { saveAsWebP } = await import("../../../lib/image");
                    const path = await import("node:path");
                    const newsDir = path.join(process.cwd(), "public", "uploads", "news", finalSlug);
                    body.image = await saveAsWebP(imageFile, newsDir, "cover");

                    // Note: Here we update the main cover image. 
                    // To handle multiple gallery images update, it would need more complex logic.
                }
            }
        } else {
            body = (await request.json()) as UpdateNewsDto;
        }

        if (Object.keys(body).length === 0) {
            return new Response(JSON.stringify({ success: false, error: "Tidak ada data yang diperbarui." }), { status: 400 });
        }

        const data = await updateNews(id, body);
        if (!data) return new Response(JSON.stringify({ success: false, error: "Berita tidak ditemukan." }), { status: 404 });
        return new Response(JSON.stringify({ success: true, data, message: "Berita berhasil diperbarui." }), { status: 200 });
    } catch (err: any) {
        if (err?.code === "23505") return new Response(JSON.stringify({ success: false, error: "Slug sudah digunakan." }), { status: 409 });
        console.error("[PUT /api/berita/:id]", err);
        return new Response(JSON.stringify({ success: false, error: "Gagal memperbarui berita." }), { status: 500 });
    }
};

export const DELETE: APIRoute = async ({ params }) => {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ success: false, error: "ID tidak valid." }), { status: 400 });

    try {
        const deleted = await deleteNews(id);
        if (!deleted) return new Response(JSON.stringify({ success: false, error: "Berita tidak ditemukan." }), { status: 404 });
        return new Response(JSON.stringify({ success: true, message: "Berita berhasil dihapus." }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: "Gagal menghapus berita." }), { status: 500 });
    }
};

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
        let existingImages: string[] = [];
        let newImageFiles: File[] = [];

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

            // Get existing images to keep
            existingImages = formData.getAll("keep_images") as string[];

            // Get new images to upload
            newImageFiles = (formData.getAll("new_images") as File[]).filter(f => f && f.size > 0);

            // 1. Validate file size (max 2MB)
            const MAX_SIZE = 2 * 1024 * 1024; // 2MB
            for (const file of newImageFiles) {
                if (file.size > MAX_SIZE) {
                    return new Response(JSON.stringify({
                        success: false,
                        error: `Ukuran gambar "${file.name}" terlalu besar. Maksimal 2MB.`
                    }), { status: 400 });
                }
            }

            const newsData = await getNewsById(id);
            if (!newsData) return new Response(JSON.stringify({ success: false, error: "Berita tidak ditemukan." }), { status: 404 });

            // 2. Cleanup unused physical files
            const imagesToRemove = newsData.images.filter(img => !existingImages.includes(img));
            if (imagesToRemove.length > 0) {
                const fs = await import("node:fs/promises");
                const path = await import("node:path");
                for (const imgUrl of imagesToRemove) {
                    // Convert URL /uploads/... to local path public/uploads/...
                    const filePath = path.join(process.cwd(), "public", imgUrl);
                    try {
                        await fs.unlink(filePath);
                    } catch (e) {
                        console.warn(`[Cleanup] Gagal menghapus file: ${filePath}`, e);
                    }
                }
            }

            const finalSlug = body.slug || newsData.slug;
            const finalImages = [...existingImages];

            if (newImageFiles.length > 0) {
                const { saveAsWebP } = await import("../../../lib/image");
                const path = await import("node:path");
                const newsDir = path.join(process.cwd(), "public", "uploads", "news", finalSlug);

                for (let i = 0; i < newImageFiles.length; i++) {
                    const timestamp = Date.now();
                    const filename = `img-${timestamp}-${i}`;
                    const url = await saveAsWebP(newImageFiles[i], newsDir, filename);
                    finalImages.push(url);
                }
            }

            // Update main cover to the first image in the list if it changed
            if (finalImages.length > 0) {
                body.image = finalImages[0];
            }

            // Sync images in DB
            const { syncNewsImages } = await import("../../berita/-api/repository");
            await syncNewsImages(id, finalImages);

        } else {
            body = (await request.json()) as UpdateNewsDto;
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
        const newsData = await getNewsById(id);
        if (newsData) {
            const fs = await import("node:fs/promises");
            const path = await import("node:path");

            // Delete all images in gallery
            for (const imgUrl of newsData.images) {
                const filePath = path.join(process.cwd(), "public", imgUrl);
                try {
                    await fs.unlink(filePath);
                } catch (e) {
                    console.warn(`[Delete] Gagal menghapus file gallery: ${filePath}`, e);
                }
            }

            // Also check main image if not in gallery (though usually it is)
            if (newsData.image && !newsData.images.includes(newsData.image)) {
                const filePath = path.join(process.cwd(), "public", newsData.image);
                try {
                    await fs.unlink(filePath);
                } catch (e) { /* ignored */ }
            }
        }

        const deleted = await deleteNews(id);
        if (!deleted) return new Response(JSON.stringify({ success: false, error: "Berita tidak ditemukan." }), { status: 404 });
        return new Response(JSON.stringify({ success: true, message: "Berita berhasil dihapus." }), { status: 200 });
    } catch (err) {
        console.error("[DELETE /api/berita/:id]", err);
        return new Response(JSON.stringify({ success: false, error: "Gagal menghapus berita." }), { status: 500 });
    }
};

// src/pages/api/program/[id].ts
import type { APIRoute } from "astro";
import { getProgramById, updateProgram, deleteProgram } from "../../program/-api/repository";
import type { UpdateProgramDto } from "../../program/-api/types";

export const prerender = false;

export const GET: APIRoute = async ({ params }) => {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ success: false, error: "ID tidak valid." }), { status: 400 });

    try {
        const data = await getProgramById(id);
        if (!data) return new Response(JSON.stringify({ success: false, error: "Program tidak ditemukan." }), { status: 404 });
        return new Response(JSON.stringify({ success: true, data }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: "Gagal mengambil program." }), { status: 500 });
    }
};

export const PUT: APIRoute = async ({ params, request }) => {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ success: false, error: "ID tidak valid." }), { status: 400 });

    try {
        const contentType = request.headers.get("Content-Type") || "";
        let body: UpdateProgramDto = {};

        if (contentType.includes("multipart/form-data")) {
            const formData = await request.formData();
            body = {
                slug: (formData.get("slug") as string)?.trim() || undefined,
                name: (formData.get("name") as string)?.trim() || undefined,
                description: (formData.get("description") as string)?.trim() || undefined,
                isPublished: formData.has("isPublished") ? formData.get("isPublished") === "true" : undefined,
            };

            const imageFile = formData.get("image") as File | null;
            if (imageFile && imageFile.size > 0) {
                // 1. Validate Size (max 2MB)
                const MAX_SIZE = 2 * 1024 * 1024;
                if (imageFile.size > MAX_SIZE) {
                    return new Response(JSON.stringify({ success: false, error: "Ukuran gambar terlalu besar. Maksimal 2MB." }), { status: 400 });
                }

                const programData = await getProgramById(id);
                if (!programData) return new Response(JSON.stringify({ success: false, error: "Program tidak ditemukan." }), { status: 404 });

                // 2. Physical Cleanup
                if (programData.image) {
                    const fs = await import("node:fs/promises");
                    const path = await import("node:path");
                    const oldPath = path.join(process.cwd(), "public", programData.image);
                    try {
                        await fs.unlink(oldPath);
                    } catch (e) {
                        console.warn(`[Cleanup] Gagal menghapus file lama: ${oldPath}`, e);
                    }
                }

                // 3. Save New Image
                const finalSlug = body.slug || programData.slug;
                const { saveAsWebP } = await import("../../../lib/image");
                const path = await import("node:path");
                const programDir = path.join(process.cwd(), "public", "uploads", "programs");
                body.image = await saveAsWebP(imageFile, programDir, finalSlug);
            }
        } else {
            body = (await request.json()) as UpdateProgramDto;
        }

        const data = await updateProgram(id, body);
        if (!data) return new Response(JSON.stringify({ success: false, error: "Program tidak ditemukan." }), { status: 404 });
        return new Response(JSON.stringify({ success: true, data, message: "Program berhasil diperbarui." }), { status: 200 });
    } catch (err: any) {
        if (err?.code === "23505") return new Response(JSON.stringify({ success: false, error: "Slug sudah digunakan." }), { status: 409 });
        console.error("[PUT /api/program/:id]", err);
        return new Response(JSON.stringify({ success: false, error: "Gagal memperbarui program." }), { status: 500 });
    }
};

export const DELETE: APIRoute = async ({ params }) => {
    const id = params.id;
    if (!id) return new Response(JSON.stringify({ success: false, error: "ID tidak valid." }), { status: 400 });

    try {
        const programData = await getProgramById(id);
        if (programData?.image) {
            const fs = await import("node:fs/promises");
            const path = await import("node:path");
            const filePath = path.join(process.cwd(), "public", programData.image);
            try {
                await fs.unlink(filePath);
            } catch (e) {
                console.warn(`[Delete] Gagal menghapus file: ${filePath}`, e);
            }
        }

        const deleted = await deleteProgram(id);
        if (!deleted) return new Response(JSON.stringify({ success: false, error: "Program tidak ditemukan." }), { status: 404 });
        return new Response(JSON.stringify({ success: true, message: "Program berhasil dihapus." }), { status: 200 });
    } catch (err) {
        return new Response(JSON.stringify({ success: false, error: "Gagal menghapus program." }), { status: 500 });
    }
};

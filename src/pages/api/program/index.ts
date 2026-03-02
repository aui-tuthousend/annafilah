// src/pages/api/program/index.ts
// ─── GET /api/program  → list all programs
// ─── POST /api/program → create new program (multipart/form-data)
import type { APIRoute } from "astro";
import { getAllPrograms, createProgram } from "../../program/-api/repository";
import type { ListProgramQuery } from "../../program/-api/types";
import { saveAsWebP } from "../../../lib/image";
import path from "node:path";

export const prerender = false;

// ─── GET: List programs ───────────────────────────────────────────────────────
export const GET: APIRoute = async ({ url }) => {
    try {
        const query: ListProgramQuery = {
            isPublished: url.searchParams.get("published") !== "false",
            limit: Number(url.searchParams.get("limit") ?? 50),
            offset: Number(url.searchParams.get("offset") ?? 0),
        };

        const data = await getAllPrograms(query);

        return new Response(
            JSON.stringify({ success: true, data, total: data.length }),
            { status: 200, headers: { "Content-Type": "application/json" } }
        );
    } catch (err) {
        console.error("[GET /api/program]", err);
        return new Response(
            JSON.stringify({ success: false, error: "Gagal mengambil data program." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

// ─── POST: Create program ─────────────────────────────────────────────────────
export const POST: APIRoute = async ({ request }) => {
    try {
        const formData = await request.formData();

        const slug = (formData.get("slug") as string)?.trim();
        const name = (formData.get("name") as string)?.trim();
        const description = (formData.get("description") as string)?.trim();
        const isPublished = formData.get("isPublished") === "true";

        const imageFile = formData.get("image") as File | null;
        const validImage = imageFile && imageFile.size > 0 && imageFile.type.startsWith("image/")
            ? imageFile : null;

        if (!slug || !name || !description) {
            return new Response(
                JSON.stringify({ success: false, error: "Semua field wajib diisi." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }
        if (!validImage) {
            return new Response(
                JSON.stringify({ success: false, error: "Gambar program wajib diupload." }),
                { status: 400, headers: { "Content-Type": "application/json" } }
            );
        }

        // Save image as WebP → public/uploads/program/{slug}.webp
        const uploadsDir = path.join(process.cwd(), "public", "uploads", "program");
        const imageUrl = await saveAsWebP(validImage, uploadsDir, slug);

        const data = await createProgram({ slug, name, image: imageUrl, description, isPublished });

        return new Response(
            JSON.stringify({ success: true, data, message: "Program berhasil dibuat." }),
            { status: 201, headers: { "Content-Type": "application/json" } }
        );
    } catch (err: any) {
        if (err?.code === "23505") {
            return new Response(
                JSON.stringify({ success: false, error: "Slug program sudah digunakan." }),
                { status: 409, headers: { "Content-Type": "application/json" } }
            );
        }
        console.error("[POST /api/program]", err);
        return new Response(
            JSON.stringify({ success: false, error: "Gagal membuat program." }),
            { status: 500, headers: { "Content-Type": "application/json" } }
        );
    }
};

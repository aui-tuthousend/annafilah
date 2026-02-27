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
        const body = (await request.json()) as UpdateNewsDto;
        const data = await updateNews(id, body);
        if (!data) return new Response(JSON.stringify({ success: false, error: "Berita tidak ditemukan." }), { status: 404 });
        return new Response(JSON.stringify({ success: true, data, message: "Berita berhasil diperbarui." }), { status: 200 });
    } catch (err: any) {
        if (err?.code === "23505") return new Response(JSON.stringify({ success: false, error: "Slug sudah digunakan." }), { status: 409 });
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

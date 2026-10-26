// src/lib/client-webp.ts
// ─── Konversi gambar ke WebP di browser ───────────────────────────────────────
// Cloudflare Workers tidak bisa menjalankan native module seperti sharp, jadi
// resize + kompresi gambar dilakukan di sisi klien sebelum file dikirim ke API.

/** Format yang tidak perlu (atau tidak bisa) dikonversi lewat canvas. */
const SKIP_TYPES = ["image/webp", "image/gif", "image/svg+xml", "image/avif"];

/**
 * Resize (maksimal `maxWidth` px, tanpa memperbesar) lalu encode ulang ke WebP.
 * Jika browser tidak mendukung, file asli dikembalikan apa adanya.
 */
export async function convertToWebP(
    file: File,
    maxWidth = 1200,
    quality = 0.85
): Promise<File> {
    if (SKIP_TYPES.includes(file.type) || !file.type.startsWith("image/")) {
        return file;
    }

    try {
        const bitmap = await createImageBitmap(file);
        const scale = Math.min(1, maxWidth / bitmap.width);
        const width = Math.round(bitmap.width * scale);
        const height = Math.round(bitmap.height * scale);

        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext("2d");
        if (!ctx) return file;

        ctx.drawImage(bitmap, 0, 0, width, height);
        bitmap.close();

        const blob = await new Promise<Blob | null>((resolve) =>
            canvas.toBlob(resolve, "image/webp", quality)
        );
        if (!blob || blob.type !== "image/webp") return file;

        const name = `${file.name.replace(/\.[^.]+$/, "")}.webp`;
        return new File([blob], name, { type: "image/webp" });
    } catch {
        // Format tidak didukung browser → kirim file asli, server tetap menerimanya.
        return file;
    }
}

/** Versi batch dari `convertToWebP`. */
export async function convertAllToWebP(
    files: File[],
    maxWidth = 1200,
    quality = 0.85
): Promise<File[]> {
    return Promise.all(files.map((file) => convertToWebP(file, maxWidth, quality)));
}

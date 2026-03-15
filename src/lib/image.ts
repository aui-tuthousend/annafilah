// src/lib/image.ts
// ─── Shared image processing utility ──────────────────────────────────────────
// Converts any uploaded image to WebP and saves to the public/uploads directory.

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

/**
 * Convert an uploaded File to WebP and save to disk.
 *
 * @param file       - File object from FormData
 * @param outputDir  - Absolute path to destination directory (created if missing)
 * @param filename   - Filename WITHOUT extension (e.g. "my-slug")
 * @param quality    - WebP quality 1-100, default 85
 * @returns          - Public URL string (e.g. "/uploads/program/my-slug.webp")
 */
export async function saveAsWebP(
    file: File,
    outputDir: string,
    filename: string,
    quality = 85
): Promise<string> {
    await fs.mkdir(outputDir, { recursive: true });

    const buffer = Buffer.from(await file.arrayBuffer());
    const outputPath = path.join(outputDir, `${filename}.webp`);

    await sharp(buffer)
        .resize({ width: 1200, withoutEnlargement: true }) // Maksimal width 1200px (tidak memperbesar jika gambar aslinya sudah kecil)
        .webp({ quality })
        .toFile(outputPath);

    // Derive public URL from output path relative to the `public` directory
    const publicDir = path.join(process.cwd(), "public");
    const relPath = path.relative(publicDir, outputPath).replace(/\\/g, "/");
    return `/${relPath}`;
}

/**
 * Delete an uploads subfolder (e.g. when a news item is deleted).
 * Silently ignores errors (folder may not exist).
 */
export async function deleteUploadsFolder(folderPath: string): Promise<void> {
    try {
        await fs.rm(folderPath, { recursive: true, force: true });
    } catch {
        // silently ignore
    }
}

// src/lib/image.ts
// ─── Shared image processing utility ──────────────────────────────────────────
// Converts any uploaded image to WebP and saves to the public/uploads directory.

import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";
import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
    region: import.meta.env.S3_REGION || process.env.S3_REGION || "auto",
    endpoint: import.meta.env.S3_ENDPOINT || process.env.S3_ENDPOINT,
    credentials: {
        accessKeyId: import.meta.env.S3_ACCESS_KEY || process.env.S3_ACCESS_KEY || "",
        secretAccessKey: import.meta.env.S3_SECRET_KEY || process.env.S3_SECRET_KEY || "",
    },
});

/**
 * Convert an uploaded File to WebP and save to S3.
 *
 * @param file       - File object from FormData
 * @param directory  - S3 prefix directory without leading/trailing clash (e.g. "uploads/program")
 * @param filename   - Filename WITHOUT extension (e.g. "my-slug")
 * @param quality    - WebP quality 1-100, default 85
 * @returns          - Public URL string (e.g. "https://pub-xxx.r2.dev/uploads/program/my-slug.webp")
 */
export async function saveAsWebP(
    file: File,
    directory: string,
    filename: string,
    quality = 85
): Promise<string> {
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const webpBuffer = await sharp(fileBuffer)
        .resize({ width: 1200, withoutEnlargement: true }) // Maksimal width 1200px (tidak memperbesar jika gambar aslinya sudah kecil)
        .webp({ quality })
        .toBuffer();

    const s3Key = `${directory}/${filename}.webp`;

    await s3Client.send(
        new PutObjectCommand({
            Bucket: import.meta.env.S3_BUCKET_NAME || process.env.S3_BUCKET_NAME,
            Key: s3Key,
            Body: webpBuffer,
            ContentType: "image/webp",
        })
    );

    const publicUrl = (import.meta.env.S3_PUBLIC_URL || process.env.S3_PUBLIC_URL)?.replace(/\/$/, "");
    return `${publicUrl}/${s3Key}`;
}

/**
 * Delete an image gracefully.
 * Handles both local paths (for backwards compatibility with old entities) and S3 public URLs.
 */
export async function deleteImage(imageUrl: string): Promise<void> {
    const publicUrl = (import.meta.env.S3_PUBLIC_URL || process.env.S3_PUBLIC_URL)?.replace(/\/$/, "");

    if (publicUrl && imageUrl.startsWith(publicUrl)) {
        // It's an S3 image
        const key = imageUrl.replace(`${publicUrl}/`, "");
        try {
            await s3Client.send(
                new DeleteObjectCommand({
                    Bucket: import.meta.env.S3_BUCKET_NAME || process.env.S3_BUCKET_NAME,
                    Key: key,
                })
            );
        } catch (e) {
            console.error(`[S3 Delete] Failed to delete image ${key}:`, e);
        }
    } else {
        // Fallback: It's an old local image (e.g. /uploads/programs/xxx.webp)
        const oldPath = path.join(process.cwd(), "public", imageUrl);
        try {
            await fs.unlink(oldPath);
        } catch (e) {
            console.warn(`[Local Delete] Failed to delete local image ${oldPath}:`, e);
        }
    }
}

/**
 * Delete an uploads subfolder locally (e.g. for backward compatibility).
 * Silently ignores errors (folder may not exist).
 */
export async function deleteUploadsFolder(folderPath: string): Promise<void> {
    try {
        await fs.rm(folderPath, { recursive: true, force: true });
    } catch {
        // silently ignore
    }
}

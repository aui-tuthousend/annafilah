// src/lib/image.ts
// ─── Simpan & hapus gambar di Cloudflare R2 (S3-compatible) ───────────────────
// Resize + konversi WebP dilakukan di browser (lihat src/lib/client-webp.ts)
// sebelum file dikirim ke API, karena Cloudflare Workers tidak bisa memakai
// native module seperti sharp.

import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { envValue } from "./runtime-env";

const EXTENSION_BY_TYPE: Record<string, string> = {
    "image/webp": "webp",
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/gif": "gif",
    "image/avif": "avif",
};

let s3Client: S3Client | undefined;

function getS3Client(): S3Client {
    if (!s3Client) {
        s3Client = new S3Client({
            region: envValue("S3_REGION", import.meta.env.S3_REGION) || "auto",
            endpoint: envValue("S3_ENDPOINT", import.meta.env.S3_ENDPOINT),
            credentials: {
                accessKeyId: envValue("S3_ACCESS_KEY", import.meta.env.S3_ACCESS_KEY) ?? "",
                secretAccessKey: envValue("S3_SECRET_KEY", import.meta.env.S3_SECRET_KEY) ?? "",
            },
        });
    }
    return s3Client;
}

function getBucketName(): string {
    return envValue("S3_BUCKET_NAME", import.meta.env.S3_BUCKET_NAME) ?? "";
}

function getPublicUrl(): string {
    return (envValue("S3_PUBLIC_URL", import.meta.env.S3_PUBLIC_URL) ?? "").replace(/\/$/, "");
}

/**
 * Simpan gambar ke R2 dan kembalikan public URL-nya.
 *
 * @param file      - File dari FormData (umumnya sudah WebP hasil konversi browser)
 * @param directory - Prefix folder di bucket, mis. "uploads/program"
 * @param filename  - Nama file tanpa ekstensi, mis. "sedekah-quran"
 */
export async function saveImage(
    file: File,
    directory: string,
    filename: string
): Promise<string> {
    const extension = EXTENSION_BY_TYPE[file.type] ?? "webp";
    const key = `${directory}/${filename}.${extension}`;

    await getS3Client().send(
        new PutObjectCommand({
            Bucket: getBucketName(),
            Key: key,
            Body: new Uint8Array(await file.arrayBuffer()),
            ContentType: file.type || "image/webp",
        })
    );

    return `${getPublicUrl()}/${key}`;
}

/**
 * Hapus gambar dari R2.
 * URL yang tidak berada di dalam bucket publik akan diabaikan.
 */
export async function deleteImage(imageUrl: string): Promise<void> {
    const publicUrl = getPublicUrl();
    if (!publicUrl || !imageUrl.startsWith(`${publicUrl}/`)) return;

    const key = imageUrl.slice(publicUrl.length + 1);

    try {
        await getS3Client().send(
            new DeleteObjectCommand({
                Bucket: getBucketName(),
                Key: key,
            })
        );
    } catch (e) {
        console.error(`[S3 Delete] Gagal menghapus ${key}:`, e);
    }
}

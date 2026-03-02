// src/pages/berita/-api/repository.ts
// ─── News CRUD logic via Drizzle ORM ─────────────────────────────────────────

import { eq, desc, and, ilike } from "drizzle-orm";
import { db } from "../../../db/index";
import { news, newsImages } from "../../../db/schema";
import type {
    CreateNewsDto,
    UpdateNewsDto,
    NewsResponse,
    NewsPreview,
    ListNewsQuery,
} from "./types";

// ─── Helper: convert DB record → Response ─────────────────────────────────────
function toResponse(
    row: typeof news.$inferSelect,
    images: string[] = []
): NewsResponse {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        category: row.category,
        author: row.author,
        location: row.location,
        image: row.image,
        images: images,
        programId: row.programId ?? null,
        isPublished: row.isPublished,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}

function toPreview(row: typeof news.$inferSelect): NewsPreview {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        category: row.category,
        author: row.author,
        location: row.location,
        image: row.image,
        programId: row.programId ?? null,
        createdAt: row.createdAt,
    };
}

// ─── READ: Get all news (with optional filters) ───────────────────────────────
export async function getAllNews(
    query: ListNewsQuery = {}
): Promise<NewsPreview[]> {
    const { category, programId, isPublished = true, limit = 50, offset = 0 } = query;

    const conditions: ReturnType<typeof eq>[] = [eq(news.isPublished, isPublished)];
    if (category) {
        conditions.push(ilike(news.category, category));
    }
    if (programId) {
        conditions.push(eq(news.programId, programId));
    }

    const rows = await db
        .select()
        .from(news)
        .where(and(...conditions))
        .orderBy(desc(news.createdAt))
        .limit(limit)
        .offset(offset);

    return rows.map(toPreview);
}

// ─── READ: Get news associated with a specific program ────────────────────────
export async function getNewsByProgram(
    programId: string,
    limit = 10
): Promise<NewsPreview[]> {
    const rows = await db
        .select()
        .from(news)
        .where(and(eq(news.programId, programId), eq(news.isPublished, true)))
        .orderBy(desc(news.createdAt))
        .limit(limit);

    return rows.map(toPreview);
}

// ─── READ: Get single news by ID (UUID) ───────────────────────────────────────
export async function getNewsById(
    id: string
): Promise<NewsResponse | null> {
    const [row] = await db
        .select()
        .from(news)
        .where(eq(news.id, id))
        .limit(1);

    if (!row) return null;

    const images = await db
        .select()
        .from(newsImages)
        .where(eq(newsImages.newsId, row.id))
        .orderBy(newsImages.sortOrder);

    return toResponse(row, images.map(img => img.url));
}

// ─── READ: Get single news by slug ────────────────────────────────────────────
export async function getNewsBySlug(
    slug: string
): Promise<NewsResponse | null> {
    const [row] = await db
        .select()
        .from(news)
        .where(and(eq(news.slug, slug), eq(news.isPublished, true)))
        .limit(1);

    if (!row) return null;

    const images = await db
        .select()
        .from(newsImages)
        .where(eq(newsImages.newsId, row.id))
        .orderBy(newsImages.sortOrder);

    return toResponse(row, images.map(img => img.url));
}

// ─── CREATE: Create new news ──────────────────────────────────────────────────
export async function createNews(
    dto: CreateNewsDto
): Promise<NewsResponse> {
    const [row] = await db
        .insert(news)
        .values({
            slug: dto.slug,
            title: dto.title,
            excerpt: dto.excerpt,
            content: dto.content,
            category: dto.category,
            author: dto.author,
            location: dto.location,
            image: dto.image,
            programId: dto.programId ?? null,
            isPublished: dto.isPublished ?? true,
        })
        .returning();

    return toResponse(row);
}

// ─── UPDATE: Update news by ID (UUID) ─────────────────────────────────────────
export async function updateNews(
    id: string,
    dto: UpdateNewsDto
): Promise<NewsResponse | null> {
    const updateData: Partial<typeof news.$inferInsert> = {
        updatedAt: new Date(),
    };

    if (dto.slug !== undefined) updateData.slug = dto.slug;
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.excerpt !== undefined) updateData.excerpt = dto.excerpt;
    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.author !== undefined) updateData.author = dto.author;
    if (dto.location !== undefined) updateData.location = dto.location;
    if (dto.image !== undefined) updateData.image = dto.image;
    if ("programId" in dto) updateData.programId = dto.programId ?? null;
    if (dto.isPublished !== undefined) updateData.isPublished = dto.isPublished;

    const [row] = await db
        .update(news)
        .set(updateData)
        .where(eq(news.id, id))
        .returning();

    return row ? toResponse(row) : null;
}

// ─── IMAGES: Add multiple images for a news item ──────────────────────────────
export async function addNewsImages(
    newsId: string,
    urls: string[]
): Promise<void> {
    if (urls.length === 0) return;

    const values = urls.map((url, index) => ({
        newsId,
        url,
        sortOrder: index, // 0 is cover
    }));

    await db.insert(newsImages).values(values);
}

// ─── DELETE: Delete news by ID (UUID) ─────────────────────────────────────────
export async function deleteNews(id: string): Promise<boolean> {
    const [row] = await db
        .delete(news)
        .where(eq(news.id, id))
        .returning({ id: news.id });

    return !!row;
}

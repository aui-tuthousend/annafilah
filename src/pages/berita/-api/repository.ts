// src/pages/berita/-api/repository.ts
// ─── News CRUD logic via Drizzle ORM ─────────────────────────────────────────

import { eq, desc, and, ilike } from "drizzle-orm";
import { db } from "../../../db/index";
import { news } from "../../../db/schema";
import type {
    CreateNewsDto,
    UpdateNewsDto,
    NewsResponse,
    NewsPreview,
    ListNewsQuery,
} from "./types";

// ─── Helper: convert DB record → Response ─────────────────────────────────────
function toResponse(row: typeof news.$inferSelect): NewsResponse {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        category: row.category,
        author: row.author,
        image: row.image,
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
        image: row.image,
        createdAt: row.createdAt,
    };
}

// ─── READ: Get all news (with optional filters) ───────────────────────────────
export async function getAllNews(
    query: ListNewsQuery = {}
): Promise<NewsPreview[]> {
    const { category, isPublished = true, limit = 50, offset = 0 } = query;

    const conditions = [eq(news.isPublished, isPublished)];
    if (category) {
        conditions.push(ilike(news.category, category));
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

// ─── READ: Get single news by ID (UUID) ───────────────────────────────────────
export async function getNewsById(
    id: string
): Promise<NewsResponse | null> {
    const [row] = await db
        .select()
        .from(news)
        .where(eq(news.id, id))
        .limit(1);

    return row ? toResponse(row) : null;
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

    return row ? toResponse(row) : null;
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
            image: dto.image,
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
    if (dto.image !== undefined) updateData.image = dto.image;
    if (dto.isPublished !== undefined) updateData.isPublished = dto.isPublished;

    const [row] = await db
        .update(news)
        .set(updateData)
        .where(eq(news.id, id))
        .returning();

    return row ? toResponse(row) : null;
}

// ─── DELETE: Delete news by ID (UUID) ─────────────────────────────────────────
export async function deleteNews(id: string): Promise<boolean> {
    const [row] = await db
        .delete(news)
        .where(eq(news.id, id))
        .returning({ id: news.id });

    return !!row;
}

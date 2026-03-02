// src/pages/artikel/-api/repository.ts
// ─── Article CRUD logic via Drizzle ORM ──────────────────────────────────────

import { eq, desc, and, ilike } from "drizzle-orm";
import { db } from "../../../db/index";
import { articles } from "../../../db/schema";
import type {
    CreateArticleDto,
    UpdateArticleDto,
    ArticleResponse,
    ArticlePreview,
    ListArticleQuery,
} from "./types";

// ─── Helper: convert DB record → Response ─────────────────────────────────────
function toResponse(row: typeof articles.$inferSelect): ArticleResponse {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        content: row.content,
        category: row.category,
        author: row.author,
        readingTime: row.readingTime,
        tags: row.tags ?? [],
        image: row.thumbnailUrl ?? "",   // thumbnailUrl in DB → image in DTO
        isPublished: row.isPublished,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}

function toPreview(row: typeof articles.$inferSelect): ArticlePreview {
    return {
        id: row.id,
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        category: row.category,
        author: row.author,
        readingTime: row.readingTime,
        tags: row.tags ?? [],
        image: row.thumbnailUrl ?? "",   // thumbnailUrl in DB → image in DTO
        createdAt: row.createdAt,
    };
}

// ─── READ: Get all articles (with optional filters) ───────────────────────────
export async function getAllArticles(
    query: ListArticleQuery = {}
): Promise<ArticlePreview[]> {
    const { category, isPublished = true, limit = 50, offset = 0 } = query;

    const conditions = [eq(articles.isPublished, isPublished)];
    if (category) {
        conditions.push(ilike(articles.category, category));
    }

    const rows = await db
        .select()
        .from(articles)
        .where(and(...conditions))
        .orderBy(desc(articles.createdAt))
        .limit(limit)
        .offset(offset);

    return rows.map(toPreview);
}

// ─── READ: Get single article by ID (UUID) ────────────────────────────────────
export async function getArticleById(
    id: string
): Promise<ArticleResponse | null> {
    const [row] = await db
        .select()
        .from(articles)
        .where(eq(articles.id, id))
        .limit(1);

    return row ? toResponse(row) : null;
}

// ─── READ: Get single article by slug ─────────────────────────────────────────
export async function getArticleBySlug(
    slug: string
): Promise<ArticleResponse | null> {
    const [row] = await db
        .select()
        .from(articles)
        .where(and(eq(articles.slug, slug), eq(articles.isPublished, true)))
        .limit(1);

    return row ? toResponse(row) : null;
}

// ─── CREATE: Create new article ───────────────────────────────────────────────
export async function createArticle(
    dto: CreateArticleDto
): Promise<ArticleResponse> {
    const [row] = await db
        .insert(articles)
        .values({
            slug: dto.slug,
            title: dto.title,
            excerpt: dto.excerpt,
            content: dto.content,
            category: dto.category,
            author: dto.author,
            readingTime: dto.readingTime,
            tags: dto.tags ?? [],
            thumbnailUrl: dto.image,     // DTO uses `image`, DB column is `thumbnailUrl`
            isPublished: dto.isPublished ?? true,
        })
        .returning();

    return toResponse(row);
}

// ─── UPDATE: Update article by ID (UUID) ──────────────────────────────────────
export async function updateArticle(
    id: string,
    dto: UpdateArticleDto
): Promise<ArticleResponse | null> {
    const updateData: Partial<typeof articles.$inferInsert> = {
        updatedAt: new Date(),
    };

    if (dto.slug !== undefined) updateData.slug = dto.slug;
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.excerpt !== undefined) updateData.excerpt = dto.excerpt;
    if (dto.content !== undefined) updateData.content = dto.content;
    if (dto.category !== undefined) updateData.category = dto.category;
    if (dto.author !== undefined) updateData.author = dto.author;
    if (dto.readingTime !== undefined) updateData.readingTime = dto.readingTime;
    if (dto.tags !== undefined) updateData.tags = dto.tags;
    if (dto.image !== undefined) updateData.thumbnailUrl = dto.image;
    if (dto.isPublished !== undefined) updateData.isPublished = dto.isPublished;

    const [row] = await db
        .update(articles)
        .set(updateData)
        .where(eq(articles.id, id))
        .returning();

    return row ? toResponse(row) : null;
}

// ─── DELETE: Delete article by ID (UUID) ──────────────────────────────────────
export async function deleteArticle(id: string): Promise<boolean> {
    const [row] = await db
        .delete(articles)
        .where(eq(articles.id, id))
        .returning({ id: articles.id });

    return !!row;
}

// ─── TOGGLE: Publish / Unpublish ──────────────────────────────────────────────
export async function togglePublish(
    id: string,
    isPublished: boolean
): Promise<ArticleResponse | null> {
    return updateArticle(id, { isPublished });
}

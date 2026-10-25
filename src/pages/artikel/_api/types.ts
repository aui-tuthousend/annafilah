// src/pages/artikel/-api/types.ts
// ─── DTO & Interfaces for Artikel feature ──────────────────────────────────────

// ─── Request DTOs ─────────────────────────────────────────────────────────────

/** Payload when creating a new article */
export interface CreateArticleDto {
    slug: string;
    title: string;
    excerpt: string;
    content: string;         // HTML
    category: string;
    author: string;
    readingTime: string;     // e.g. "5 min"
    tags?: string[];
    image: string;
    isPublished?: boolean;
}

/** Payload when updating an article */
export type UpdateArticleDto = Partial<Omit<CreateArticleDto, "slug">> & {
    slug?: string;
};

// ─── Response DTOs ────────────────────────────────────────────────────────────

/** Full article as stored in DB */
export interface ArticleResponse {
    id: string;              // UUID
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    readingTime: string;
    tags: string[];
    image: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/** Ringkas preview for listing & carousel */
export interface ArticlePreview {
    id: string;              // UUID
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    readingTime: string;
    tags: string[];
    image: string;
    createdAt: Date;
}

// ─── API Wrapper ──────────────────────────────────────────────────────────────

export interface ApiSuccess<T> {
    success: true;
    data: T;
    message?: string;
}

export interface ApiError {
    success: false;
    error: string;
    details?: unknown;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError;

// ─── Filter / Query Params ────────────────────────────────────────────────────

export interface ListArticleQuery {
    category?: string;
    isPublished?: boolean;
    limit?: number;
    offset?: number;
}

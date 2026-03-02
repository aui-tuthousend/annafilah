// src/pages/berita/-api/types.ts
// ─── DTO & Interfaces for Berita (News) feature ──────────────────────────────

// ─── Request DTOs ─────────────────────────────────────────────────────────────

/** Payload when creating new news */
export interface CreateNewsDto {
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    location: string;
    image: string;
    programId?: string | null;   // optional association to a program
    isPublished?: boolean;
}

/** Payload when updating news */
export type UpdateNewsDto = Partial<Omit<CreateNewsDto, "slug">> & {
    slug?: string;
};

// ─── Response DTOs ────────────────────────────────────────────────────────────

/** Full news as stored in DB */
export interface NewsResponse {
    id: string;              // UUID
    slug: string;
    title: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    location: string;
    image: string;
    images: string[];
    programId: string | null;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

/** Ringkas preview for listing & carousel */
export interface NewsPreview {
    id: string;              // UUID
    slug: string;
    title: string;
    excerpt: string;
    category: string;
    author: string;
    location: string;
    image: string;
    programId: string | null;
    createdAt: Date;
}

// ─── Filter / Query Params ────────────────────────────────────────────────────

export interface ListNewsQuery {
    category?: string;
    programId?: string;      // filter by associated program
    isPublished?: boolean;
    limit?: number;
    offset?: number;
}

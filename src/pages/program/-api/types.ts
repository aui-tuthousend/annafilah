// src/pages/program/-api/types.ts
// ─── DTO & Interfaces for Program feature ─────────────────────────────────────

export interface CreateProgramDto {
    slug: string;
    name: string;
    image: string;
    description: string;  // HTML
    isPublished?: boolean;
}

export type UpdateProgramDto = Partial<Omit<CreateProgramDto, "slug">> & {
    slug?: string;
};

export interface ProgramResponse {
    id: string;
    slug: string;
    name: string;
    image: string;
    description: string;
    isPublished: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProgramPreview {
    id: string;
    slug: string;
    name: string;
    image: string;
    createdAt: Date;
}

export interface ListProgramQuery {
    isPublished?: boolean;
    limit?: number;
    offset?: number;
}

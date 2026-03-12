// src/pages/program/-api/repository.ts
// ─── Program CRUD logic via Drizzle ORM ──────────────────────────────────────

import { eq, desc, and } from "drizzle-orm";
import { db } from "../../../db/index";
import { programs } from "../../../db/schema";
import type {
    CreateProgramDto,
    UpdateProgramDto,
    ProgramResponse,
    ProgramPreview,
    ListProgramQuery,
} from "./types";

// ─── Helper: convert DB record → Response ─────────────────────────────────────
function toResponse(row: typeof programs.$inferSelect): ProgramResponse {
    return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        image: row.image,
        description: row.description,
        isPublished: row.isPublished,
        createdAt: row.createdAt,
        updatedAt: row.updatedAt,
    };
}

function toPreview(row: typeof programs.$inferSelect): ProgramPreview {
    return {
        id: row.id,
        slug: row.slug,
        name: row.name,
        image: row.image,
        createdAt: row.createdAt,
    };
}

// ─── READ: Get all programs ───────────────────────────────────────────────────
export async function getAllPrograms(
    query: ListProgramQuery = {}
): Promise<ProgramPreview[]> {
    const { isPublished = true, limit = 50, offset = 0 } = query;

    const rows = await db
        .select()
        .from(programs)
        .where(eq(programs.isPublished, isPublished))
        .orderBy(desc(programs.createdAt))
        .limit(limit)
        .offset(offset);

    return rows.map(toPreview);
}

// ─── READ: Get single program by slug (Public: only published) ───────────────
export async function getProgramBySlug(
    slug: string
): Promise<ProgramResponse | null> {
    const [row] = await db
        .select()
        .from(programs)
        .where(and(eq(programs.slug, slug), eq(programs.isPublished, true)))
        .limit(1);

    return row ? toResponse(row) : null;
}

// ─── READ: Get single program by slug (Admin: including draft) ───────────────
export async function getProgramBySlugAdmin(
    slug: string
): Promise<ProgramResponse | null> {
    const [row] = await db
        .select()
        .from(programs)
        .where(eq(programs.slug, slug))
        .limit(1);

    return row ? toResponse(row) : null;
}

// ─── READ: Get single program by ID ───────────────────────────────────────────
export async function getProgramById(
    id: string
): Promise<ProgramResponse | null> {
    const [row] = await db
        .select()
        .from(programs)
        .where(eq(programs.id, id))
        .limit(1);

    return row ? toResponse(row) : null;
}

// ─── CREATE: Create new program ───────────────────────────────────────────────
export async function createProgram(
    dto: CreateProgramDto
): Promise<ProgramResponse> {
    const [row] = await db
        .insert(programs)
        .values({
            slug: dto.slug,
            name: dto.name,
            image: dto.image,
            description: dto.description,
            isPublished: dto.isPublished ?? true,
        })
        .returning();

    return toResponse(row);
}

// ─── UPDATE: Update program by ID ─────────────────────────────────────────────
export async function updateProgram(
    id: string,
    dto: UpdateProgramDto
): Promise<ProgramResponse | null> {
    const updateData: Partial<typeof programs.$inferInsert> = {
        updatedAt: new Date(),
    };

    if (dto.slug !== undefined) updateData.slug = dto.slug;
    if (dto.name !== undefined) updateData.name = dto.name;
    if (dto.image !== undefined) updateData.image = dto.image;
    if (dto.description !== undefined) updateData.description = dto.description;
    if (dto.isPublished !== undefined) updateData.isPublished = dto.isPublished;

    const [row] = await db
        .update(programs)
        .set(updateData)
        .where(eq(programs.id, id))
        .returning();

    return row ? toResponse(row) : null;
}

// ─── DELETE: Delete program by ID ─────────────────────────────────────────────
export async function deleteProgram(id: string): Promise<boolean> {
    const [row] = await db
        .delete(programs)
        .where(eq(programs.id, id))
        .returning({ id: programs.id });

    return !!row;
}

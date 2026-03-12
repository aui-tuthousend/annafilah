import { sql } from "drizzle-orm";
import {
    text,
    pgTable,
    timestamp,
    boolean,
    uuid,
    integer,
} from "drizzle-orm/pg-core";

// ─── Articles ─────────────────────────────────────────────────────────────────
// Stores articles displayed on the /artikel page (single thumbnail image)
export const articles = pgTable("articles", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),          // HTML content
    category: text("category").notNull(),
    author: text("author").notNull(),
    readingTime: text("reading_time").notNull(),  // e.g. "5 menit baca"
    tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
    thumbnailUrl: text("thumbnail_url"),          // single image for artikel
    isPublished: boolean("is_published").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

// ─── Programs ─────────────────────────────────────────────────────────────────
// Program kerja unggulan displayed on the /program page
export const programs = pgTable("programs", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    name: text("name").notNull(),
    image: text("image").notNull(),              // cover / thumbnail image
    description: text("description").notNull(), // HTML content
    isPublished: boolean("is_published").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

// ─── News ─────────────────────────────────────────────────────────────────────
// Stores news items displayed on the /berita page (supports multiple images)
export const news = pgTable("news", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    category: text("category").notNull(),
    author: text("author").notNull(),
    location: text("location").notNull().default("Surabaya"),
    image: text("image").notNull(),              // cover image (gambar pertama)
    // Optional association to a program — nullable
    programId: uuid("program_id")
        .references(() => programs.id, { onDelete: "set null" }),
    isPublished: boolean("is_published").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

// ─── News Images (many-to-one) ────────────────────────────────────────────────
// Multiple images belonging to one news item; sortOrder 0 = cover
export const newsImages = pgTable("news_images", {
    id: uuid("id").primaryKey().defaultRandom(),
    newsId: uuid("news_id")
        .notNull()
        .references(() => news.id, { onDelete: "cascade" }),
    url: text("url").notNull(),
    altText: text("alt_text"),                           // optional alt text
    sortOrder: integer("sort_order").default(0).notNull(), // 0 = cover
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

// ─── Users ────────────────────────────────────────────────────────────────────
// Admin users yang dapat login ke panel manajemen konten
export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    username: text("username").notNull().unique(),
    passwordHash: text("password_hash").notNull(),
    role: text("role").notNull().default("admin"),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

// ─── Sessions ─────────────────────────────────────────────────────────────────
// Session token yang disimpan di database; ID-nya juga disimpan dalam cookie
export const sessions = pgTable("sessions", {
    id: text("id").primaryKey(),             // 64-char hex random token
    userId: uuid("user_id")
        .notNull()
        .references(() => users.id, { onDelete: "cascade" }),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

export type Program = typeof programs.$inferSelect;
export type NewProgram = typeof programs.$inferInsert;

export type News = typeof news.$inferSelect;
export type NewNews = typeof news.$inferInsert;

export type NewsImage = typeof newsImages.$inferSelect;
export type NewNewsImage = typeof newsImages.$inferInsert;

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;

export type Session = typeof sessions.$inferSelect;
export type NewSession = typeof sessions.$inferInsert;

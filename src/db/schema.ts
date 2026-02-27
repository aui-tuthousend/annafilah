import { sql } from "drizzle-orm";
import {
    text,
    pgTable,
    timestamp,
    boolean,
    uuid,
} from "drizzle-orm/pg-core";

// ─── Articles ─────────────────────────────────────────────────────────────────
// Stores articles displayed on the /artikel page
export const articles = pgTable("articles", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),          // HTML content
    category: text("category").notNull(),
    author: text("author").notNull(),
    readingTime: text("reading_time").notNull(),  // e.g. "5 min"
    tags: text("tags").array().notNull().default(sql`ARRAY[]::text[]`),
    image: text("image").notNull(),
    isPublished: boolean("is_published").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

// ─── News ─────────────────────────────────────────────────────────────────────
// Stores news items displayed on the /berita page
export const news = pgTable("news", {
    id: uuid("id").primaryKey().defaultRandom(),
    slug: text("slug").notNull().unique(),
    title: text("title").notNull(),
    excerpt: text("excerpt").notNull(),
    content: text("content").notNull(),
    category: text("category").notNull(),
    author: text("author").notNull(),
    image: text("image").notNull(),
    isPublished: boolean("is_published").default(true).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
        .defaultNow()
        .notNull(),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────
export type Article = typeof articles.$inferSelect;
export type NewArticle = typeof articles.$inferInsert;

export type News = typeof news.$inferSelect;
export type NewNews = typeof news.$inferInsert;

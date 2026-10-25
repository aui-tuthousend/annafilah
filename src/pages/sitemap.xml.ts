// src/pages/sitemap.xml.ts
// ─── Sitemap dinamis ──────────────────────────────────────────────────────────
// Dibuat manual (bukan @astrojs/sitemap) karena halaman detail berita, artikel,
// dan program dirender on-demand sehingga tidak terdeteksi saat build.

import type { APIRoute } from "astro";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { articles, news, programs } from "../db/schema";

export const prerender = false;

// Halaman statis yang boleh diindeks (halaman admin sengaja tidak disertakan)
const STATIC_PATHS = ["/", "/about", "/berita", "/artikel", "/program"];

interface SitemapEntry {
    path: string;
    lastmod?: Date;
}

function escapeXml(value: string): string {
    return value
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

export const GET: APIRoute = async ({ site }) => {
    const base = (site?.origin ?? "https://annafilah.id").replace(/\/$/, "");

    const [newsRows, articleRows, programRows] = await Promise.all([
        db
            .select({ slug: news.slug, updatedAt: news.updatedAt })
            .from(news)
            .where(eq(news.isPublished, true)),
        db
            .select({ slug: articles.slug, updatedAt: articles.updatedAt })
            .from(articles)
            .where(eq(articles.isPublished, true)),
        db
            .select({ slug: programs.slug, updatedAt: programs.updatedAt })
            .from(programs)
            .where(eq(programs.isPublished, true)),
    ]);

    const entries: SitemapEntry[] = [
        ...STATIC_PATHS.map((path) => ({ path })),
        ...newsRows.map((row) => ({
            path: `/berita/${row.slug}`,
            lastmod: row.updatedAt,
        })),
        ...articleRows.map((row) => ({
            path: `/artikel/${row.slug}`,
            lastmod: row.updatedAt,
        })),
        ...programRows.map((row) => ({
            path: `/program/${row.slug}`,
            lastmod: row.updatedAt,
        })),
    ];

    const urls = entries
        .map(({ path, lastmod }) => {
            const lastmodTag = lastmod
                ? `<lastmod>${lastmod.toISOString()}</lastmod>`
                : "";
            return `  <url><loc>${escapeXml(`${base}${path}`)}</loc>${lastmodTag}</url>`;
        })
        .join("\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;

    return new Response(xml, {
        status: 200,
        headers: { "Content-Type": "application/xml; charset=utf-8" },
    });
};

import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ page: string }> }) {
    let { page } = await params || 10;
    if (!page.includes(".xml")) notFound();
    page = page.substring(0, page.indexOf("."));
    const pageSize = 5; // giống pageSize trong sitemap.xml
    const skip = (Number(page) - 1) * pageSize;
    // Gọi API listVideos(skip, take)
    const videos = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/video/list?skip=${skip}&take=${pageSize}`
    )
        .then((r) => r.json());

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const video of videos) {
        xml += `<url>
    <loc>${process.env.BASE_URL}/video/${video.path}</loc>`;

        if (video.updatedAt) {
            xml += `
    <lastmod>${new Date(video.updatedAt).toISOString()}</lastmod>`;
        }

        xml += `
  </url>\n`;
    }

    xml += `</urlset>`;

    return new NextResponse(xml, {
        headers: { "Content-Type": "application/xml" },
    });
}

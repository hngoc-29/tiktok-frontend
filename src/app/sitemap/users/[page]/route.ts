import { notFound } from "next/navigation";
import { NextResponse } from "next/server";

export async function GET(_: Request, { params }: { params: Promise<{ page: string }> }) {
    let { page } = await params || 10;
    if (!page.includes(".xml")) notFound();
    page = page.substring(0, page.indexOf("."));
    const pageSize = 5; // giống pageSize trong sitemap.xml
    const skip = (Number(page) - 1) * pageSize;
    // Gọi API listVideos(skip, take)
    const users = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/list?skip=${skip}&take=${pageSize}`
    )
        .then((r) => r.json());

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

    for (const user of users) {
        xml += `<url>
    <loc>${process.env.BASE_URL}/user/${user.username}</loc>`;

        if (user.updatedAt) {
            xml += `
    <lastmod>${new Date(user.updatedAt).toISOString()}</lastmod>`;
        }

        xml += `
  </url>\n`;
    }

    xml += `</urlset>`;

    return new NextResponse(xml, {
        headers: { "Content-Type": "application/xml" },
    });
}

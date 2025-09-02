import { NextResponse } from "next/server";

export async function GET() {
  // Khởi tạo header XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Danh sách route muốn sitemap
  const routes = ['', 'create', 'profile'];

  // Thêm các route vào sitemap
  xml += routes
    .map(
      (route) => `
  <url>
    <loc>${process.env.BASE_URL}/${route}</loc>
  </url>`
    )
    .join('');

  xml += `\n</urlset>`;

  return new NextResponse(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}

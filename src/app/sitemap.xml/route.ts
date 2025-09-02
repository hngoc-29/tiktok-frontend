// app/sitemap.xml/route.ts
import { NextResponse } from "next/server";

const videos = async () => {
    const totalVideos = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video/count`).then(r => r.json()).then(d => d.data);
    const pageSize = 5;
    const totalSitemaps = Math.ceil(totalVideos / pageSize);
    let xml = ``;
    for (let i = 1; i <= totalSitemaps; i++) {
        xml += `<sitemap><loc>${process.env.BASE_URL}/sitemap/videos/${i}.xml</loc></sitemap>\n`;
    }

    return xml
}

const users = async () => {
    const totalUsers = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/count`).then(r => r.json()).then(d => d.data);
    const pageSize = 5;
    const totalSitemaps = Math.ceil(totalUsers / pageSize);
    let xml = ``;
    for (let i = 1; i <= totalSitemaps; i++) {
        xml += `<sitemap><loc>${process.env.BASE_URL}/sitemap/users/${i}.xml</loc></sitemap>\n`;
    }

    return xml
}

export async function GET() {
    // Giả sử bạn có API lấy tổng số video

    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;
    xml += await videos();
    xml += await users();
    xml += `</sitemapindex>`;

    return new NextResponse(xml, {
        headers: { "Content-Type": "application/xml" },
    });
}

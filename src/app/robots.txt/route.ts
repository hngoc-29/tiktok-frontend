// app/robots.txt/route.ts
export async function GET() {
  const content = `
User-agent: *
Allow: /
Disallow: /login
Disallow: /register
Disallow: /reset-password
Disallow: /api/
Disallow: /admin/
Disallow: /dashboard/
Sitemap: ${process.env.BASE_URL}/sitemap.xml
Host: ${process.env.BASE_URL}
`;

  return new Response(content, {
    headers: {
      "Content-Type": "text/plain",
    },
  });
}



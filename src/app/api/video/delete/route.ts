import { getCookie } from "@/helps/cookie";

export async function POST(request: Request) {
    const { searchParams } = new URL(request.url);
    const videoId = searchParams.get("videoId") || ""
    const token = await getCookie("access_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video/delete?videoId=${videoId}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}
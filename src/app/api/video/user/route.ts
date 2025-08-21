import { getCookie } from "@/helps/cookie";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("userId");
    const res = await fetch(`${process.env.BACKEND_URL}/video/user?userId=${id}`, {
        method: 'GET',
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}
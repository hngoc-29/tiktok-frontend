import { getCookie } from "@/helps/cookie";

export async function GET(request: Request) {
    const token = await getCookie("access_token");
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/like/list`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), {
        headers: { 'Content-Type': 'application/json' }
    });
}
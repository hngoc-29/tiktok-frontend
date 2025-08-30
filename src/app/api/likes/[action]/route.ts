// src/app/api/like/[action]/route.ts
import { getCookie } from "@/helps/cookie";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
    req: NextRequest,
    { params }: { params: Promise<{ action: string }> }
) {
    try {
        const body = await req.json();
        const token = await getCookie(`access_token`);
        const { action } = await params; // extract action from promise

        if (!body.videoId) {
            return NextResponse.json({ success: false, message: "Video không hợp lệ" }, { status: 400 });
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/like/${action}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            },
            body: JSON.stringify(body),
        });
        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Lỗi server Next.js" }, { status: 500 });
    }
}

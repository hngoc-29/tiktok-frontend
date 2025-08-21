// src/app/api/like/[action]/route.ts
import { getCookie } from "@/helps/cookie";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const token = await getCookie(`access_token`);

        if (!body.videoId) {
            return NextResponse.json(
                { success: false, message: "Video không hợp lệ" },
                { status: 400 }
            );
        }

        // gọi sang backend NestJS
        const res = await fetch(`${process.env.BACKEND_URL}/like/video-user?videoId=${body.videoId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { "Authorization": `Bearer ${token}` } : {}),
            },
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { success: false, message: "Lỗi server Next.js" },
            { status: 500 }
        );
    }
}

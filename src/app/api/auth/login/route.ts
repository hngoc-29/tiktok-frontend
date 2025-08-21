import { NextResponse } from "next/server";
import { setCookie } from "@/helps/cookie";

export async function POST(request: Request) {
    const body = await request.json();

    const res = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();
    const { token, refreshToken, ...other } = data;

    // ✅ tạo response
    const response = NextResponse.json(other);

    if (data.success) {
        setCookie(response, "access_token", token, 60 * 60 * 24 * 7);
        setCookie(response, "refresh_token", refreshToken, 60 * 60 * 24 * 7);
    }

    return response; // 👈 return đúng response đã set cookie
}

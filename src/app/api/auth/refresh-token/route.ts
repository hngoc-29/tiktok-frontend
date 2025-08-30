// app/api/auth/refresh-token/route.ts
import { getCookie, setCookie } from "@/helps/cookie";
import { NextResponse } from "next/server";

export async function POST() {
    try {
        const refresh_token = await getCookie("refresh_token"); // <-- đúng cookie

        if (!refresh_token) {
            return NextResponse.json({ success: false, message: "No refresh token" }, { status: 200 });
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refreshToken: refresh_token }),
        });

        const data = await res.json();

        if (!data.success) {
            return NextResponse.json({ success: false }, { status: 200 });
        }

        // cập nhật cookie mới
        const response = NextResponse.json({ success: true });
        setCookie(response, "access_token", data.token, 60 * 60 * 24 * 7);
        setCookie(response, "refresh_token", data.refreshToken, 60 * 60 * 24 * 7);

        return response;
    } catch (error) {
        return NextResponse.json({ success: false, message: "Refresh failed" }, { status: 500 });
    }
}

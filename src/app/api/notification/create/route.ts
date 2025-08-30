import { NextRequest, NextResponse } from "next/server";
import { getCookie } from "@/helps/cookie";

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const token = await getCookie(`access_token`);
        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/create`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // có thể thêm Authorization nếu backend yêu cầu
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (err) {
        console.error(err);
        return NextResponse.json(
            { success: false, message: "Lỗi server Next.js" },
            { status: 500 }
        );
    }
}

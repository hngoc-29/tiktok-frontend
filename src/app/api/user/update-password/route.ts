import { getCookie } from "@/helps/cookie";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
    try {
        const token = await getCookie("access_token");
        const body = await request.json(); // đọc dữ liệu gửi lên (name, password, ...)

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/update-password`, {
            method: "PUT",
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(body), // forward dữ liệu
        });

        const data = await res.json();

        return new Response(JSON.stringify(data), {
            status: res.status,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Lỗi không xác định" }, { status: 500 });
    }
}
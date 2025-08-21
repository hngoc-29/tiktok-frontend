import { getCookie } from "@/helps/cookie";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    try {
        const token = await getCookie(`access_token`);
        const { active } = await req.json();
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json(
                { success: false, message: "Thiếu id" },
                { status: 400 }
            );
        }

        const res = await fetch(`${process.env.BACKEND_URL}/notification/update-active/${id}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ active })
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

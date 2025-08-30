import { getCookie } from "@/helps/cookie";
import { NextRequest, NextResponse } from "next/server";

export async function DELETE(req: NextRequest) {
    try {
        const token = await getCookie(`access_token`);
        const { searchParams } = new URL(req.url);
        const id = searchParams.get("id");
        if (!id) {
            return NextResponse.json(
                { success: false, message: "Thiếu id" },
                { status: 400 }
            );
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/delete/${id}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
            },
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

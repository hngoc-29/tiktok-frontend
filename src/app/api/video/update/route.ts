import { getCookie } from "@/helps/cookie";
import { NextRequest, NextResponse } from "next/server";

export async function PUT(req: NextRequest) {
    const token = await getCookie(`access_token`);
    const form = await req.formData();

    const title = form.get("title") as string;
    const fileThumbnail = form.get("fileThumbnail") as File | null;
    console.log(title, fileThumbnail)
    if (!title && !fileThumbnail) {
        return NextResponse.json({ success: false, message: "Thiếu dữ liệu" }, { status: 200 });
    }

    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            // ❌ KHÔNG set 'Content-Type': 'multipart/form-data' (fetch tự set khi body là FormData)
        },
        body: form,
    });

    const data = await res.json();

    return NextResponse.json(data);
}

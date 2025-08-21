import { getCookie } from "@/helps/cookie";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
    try {
        const token = await getCookie("access_token");
        const formData = await req.formData();
        const file = formData.get("avatar") as File | null;

        if (!file) {
            return NextResponse.json({ success: false, message: "Không tìm thấy ảnh" }, { status: 400 });
        }

        // forward formData sang backend
        const res = await fetch(`${process.env.BACKEND_URL}/user`, {
            method: "PUT",
            headers: {
                'Authorization': `Bearer ${token}`,
            },
            body: formData,
        });

        const data = await res.json();
        console.log(data);

        return NextResponse.json(data);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ success: false, message: "Upload failed" }, { status: 500 });
    }
}

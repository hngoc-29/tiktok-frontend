import { getCookie } from "@/helps/cookie";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const token = await getCookie(`access_token`);

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/get-all`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

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

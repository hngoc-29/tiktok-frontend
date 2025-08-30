import { getCookie } from "@/helps/cookie";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const token = await getCookie(`access_token`);
        const url = new URL(req.url);
        const skip = url.searchParams.get("skip") || "0";
        const take = url.searchParams.get("take") || "10";

        const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/follow/getFollowers?skip=${skip}&take=${take}`,
            {
                headers: { 'Authorization': `Bearer ${token}` },
                cache: 'no-store' // đảm bảo dữ liệu mới
            }
        );

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Lỗi không xác định" }, { status: 500 });
    }
}

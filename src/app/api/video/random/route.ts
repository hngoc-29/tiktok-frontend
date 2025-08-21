import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const excludeIds = searchParams.get("excludeIds") || "";
    const n = searchParams.get("n") || "3";

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/video/random?excludeIds=${excludeIds}&n=${n}`);
        const data = await res.json();

        return NextResponse.json(data);
    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Lỗi không xác định" }, { status: 500 });
    }
}

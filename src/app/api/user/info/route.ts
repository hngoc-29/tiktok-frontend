import { NextResponse } from "next/server";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
        return NextResponse.json({ success: false, message: "Thiếu userId" }, { status: 400 });
    }

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/user/info?userId=${userId}`);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Lỗi không xác định" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");

    if (!username) {
        return NextResponse.json({ success: false, message: "Thiếu username" }, { status: 400 });
    }

    try {
        const res = await fetch(`${process.env.BACKEND_URL}/user?username=${username}`);
        const data = await res.json();
        return NextResponse.json(data);
    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Lỗi không xác định" }, { status: 500 });
    }
}

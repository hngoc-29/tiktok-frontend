import { getCookie } from "@/helps/cookie";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const videoId = searchParams.get("videoId");
        const skip = Number(searchParams.get("skip") || 0);
        const take = Number(searchParams.get("take") || 10);

        if (!videoId) {
            return NextResponse.json(
                { success: false, message: "Thiếu videoId" },
                { status: 400 }
            );
        }

        const res = await fetch(
            `${process.env.BACKEND_URL}/comment/list?videoId=${videoId}&skip=${skip}&take=${take}`
        );
        const data = await res.json();

        return NextResponse.json(data);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Lỗi không xác định";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const { searchParams } = new URL(req.url);
    const videoId = searchParams.get("videoId");
    const token = await getCookie(`access_token`);

    if (!videoId) {
        return NextResponse.json(
            { success: false, message: "Thiếu videoId" },
            { status: 400 }
        );
    }

    const body = await req.json();
    try {
        const res = await fetch(
            `${process.env.BACKEND_URL}/comment/create?videoId=${videoId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            }
        );
        const data = await res.json();

        return NextResponse.json(data);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Lỗi không xác định";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const commentId = searchParams.get("commentId");
    const token = await getCookie(`access_token`);

    if (!commentId) {
        return NextResponse.json(
            { success: false, message: "Thiếu commentId" },
            { status: 400 }
        );
    }

    try {
        const res = await fetch(
            `${process.env.BACKEND_URL}/comment/delete?commentId=${commentId}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
            }
        );
        const data = await res.json();

        return NextResponse.json(data);
    } catch (error: unknown) {
        const message = error instanceof Error ? error.message : "Lỗi không xác định";
        return NextResponse.json({ success: false, message }, { status: 500 });
    }
}

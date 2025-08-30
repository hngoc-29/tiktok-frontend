import { getCookie } from "@/helps/cookie";
import { NextRequest, NextResponse } from "next/server";

interface FollowBody {
    followingId: number;
}

export async function POST(req: NextRequest) {
    try {
        const body: FollowBody = await req.json();
        const token = await getCookie(`access_token`);

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/follow/followUser`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${token}`,

            },
            body: JSON.stringify(body),
        });

        const data = await res.json();
        return NextResponse.json(data, { status: res.status });
    } catch (error: unknown) {
        return NextResponse.json({ success: false, message: error instanceof Error ? error.message : "Lỗi không xác định" }, { status: 500 });
    }
}

import { getCookie } from "@/helps/cookie";
import { NextResponse } from "next/server";

export async function GET() {
    const token = await getCookie('access_token');
    return NextResponse.json({ success: true, access_token: token || '' });
}

import { NextResponse } from "next/server";
import { setCookie } from "@/helps/cookie";

export async function POST(request: Request) {
    const body = await request.json();

    const res = await fetch(`${process.env.BACKEND_URL}/auth/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    });

    const data = await res.json();

    const response = NextResponse.json(data);
    return response; // 👈 return đúng response đã set cookie
}

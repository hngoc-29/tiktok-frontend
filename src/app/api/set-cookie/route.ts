// app/api/set-cookie/route.ts
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { tokenname, value, exp } = await req.json();
    console.log(tokenname, value, exp)
    const res = NextResponse.json({ success: true });

    // Set cookie trực tiếp
    res.cookies.set(tokenname, value, {
        path: "/",
        maxAge: Number(exp), // exp tính bằng giây
        httpOnly: true,      // nếu muốn không cho JS frontend đọc
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
    });

    return res;
}

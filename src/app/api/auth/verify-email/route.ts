import { getCookie, setCookie } from "@/helps/cookie";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { token } = await req.json();
    const accessToken = await getCookie(`access_token`);

    const res = await fetch(`${process.env.BACKEND_URL}/auth/verify-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ token }),
    });

    const data = await res.json();
    const response = NextResponse.json(data);

    // Nếu muốn xóa cookie khi verify thất bại
    if (data.success) {
      setCookie(response, "access_token", data.token, 60 * 60 * 24 * 7);
      setCookie(response, "refresh_token", data.refreshToken, 60 * 60 * 24 * 7);
    }

    return response;
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Lỗi server" },
      { status: 500 }
    );
  }
}

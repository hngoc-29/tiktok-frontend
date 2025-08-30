// src/app/api/notifications/active/route.ts
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/notification/active`, {
      cache: "no-store",
    });
    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: "Lỗi lấy thông báo" },
      { status: 500 }
    );
  }
}

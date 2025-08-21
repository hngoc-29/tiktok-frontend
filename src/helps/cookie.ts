import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const setCookie = (
    response: NextResponse,
    name: string,
    payload: string,
    exp: number
): void => {
    response.cookies.set({
        name,
        value: payload,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: exp,
    });
};

export async function getCookie(cookieName: string): Promise<string | undefined> {
    const cookieStore = await cookies()
    const token = cookieStore.get(cookieName)?.value;
    return token;
}

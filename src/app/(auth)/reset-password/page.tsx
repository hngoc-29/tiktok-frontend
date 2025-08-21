// app/(auth)/reset-password/page.ts

import React from "react";
import ResetPassword from "./ResetPassword";
import { Metadata } from "next";

interface PageProps {
    searchParams: { token?: string }; // token là query param
}
type SearchParams = Promise<{ [key: string]: string | string[] | undefined }>;
export const metadata: Metadata = {
    title: "TopTop | Lấy lại mật khẩu",
    description: "Trang lấy lại mật khẩu của toptop",
};

export default async function Page(props: { searchParams: SearchParams }) {
    const searchParams = await props.searchParams;
    const tokenParam = searchParams.token;
    const token = Array.isArray(tokenParam) ? tokenParam[0] : tokenParam || '';
    console.log(token)
    return (
        <div>
            <ResetPassword token={token || ``} />
        </div>
    );
}
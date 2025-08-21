import React from 'react'
import ForgetPasswordPage from './ForgetPassword'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "TopTop | Quên mật khẩu",
    description: "Trang quên mật khẩu của toptop",
};
export default function page() {
    return (
        <>
            <ForgetPasswordPage />
        </>
    )
}

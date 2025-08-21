import React from 'react'
import CreateVideo from './CreateVideo'
import { Metadata } from 'next';
export const metadata: Metadata = {
    title: "TopTop | Tạo video",
    description: "Trang tạo video của toptop",
};
export default function page() {
    return (
        <div>
            <CreateVideo />
        </div>
    )
}

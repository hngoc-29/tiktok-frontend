import VideoCard from '@/components/ui/VideoCard'
import React from 'react'
import { generateVideoMetadata } from './metadata';
import VideoCP from './Video';
import Link from 'next/link';

interface PageProps {
    params: Promise<{ path: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { path } = await params;
    return generateVideoMetadata(path);
}

export default async function page({ params }: PageProps) {
    const { path } = await params;
    let res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video?path=${path}`);
    let data = await res.json();
    if (!data.success) {
        return (
            <div
                style={{
                    height: "100vh",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    background: "#000",
                    color: "#fff",
                    fontSize: "18px",
                    flexDirection: "column",
                }}
            >
                <p>🚫 Video không tồn tại hoặc đã bị xóa</p>
                <Link
                    href="/"
                    style={{
                        marginTop: "12px",
                        padding: "8px 16px",
                        background: "#ff0050",
                        borderRadius: "8px",
                        color: "#fff",
                        textDecoration: "none",
                        fontWeight: "bold",
                    }}
                >
                    Quay lại trang chủ
                </Link>
            </div>
        );
    }
    const video = data.video;
    res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user/info?userId=${video.userId}`);
    data = await res.json();
    const author = data.user;
    return (
        <div>
            <VideoCP video={video} author={author} />
        </div>
    )
}

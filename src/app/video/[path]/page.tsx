import VideoCard from '@/components/ui/VideoCard'
import React from 'react'
import { generateVideoMetadata } from './metadata';

interface PageProps {
    params: Promise<{ path: string }>;
}

export async function generateMetadata({ params }: PageProps) {
    const { path } = await params;
    return generateVideoMetadata(path);
}

export default async function page({ params }: PageProps) {
    const { path } = await params;
    console.log(path)
    let res = await fetch(`${process.env.BACKEND_URL}/video?path=${path}`);
    let data = await res.json();
    if (!data.success) {
        return <div>

        </div>
    }
    const video = data.video;
    res = await fetch(`${process.env.BACKEND_URL}/user/info?userId=${video.userId}`);
    data = await res.json();
    const author = data.user;
    return (
        <div>
            <VideoCard video={video} author={author} />
        </div>
    )
}

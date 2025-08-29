"use client"

import VideoCard from "@/components/ui/VideoCard";
import { User, Video } from "@/type/types";
import { useState } from "react";

export default function VideoCP({ video, author }: { video: Video, author: User }) {
    const [muted, setMuted] = useState(true);
    return (
        <VideoCard video={video} author={author} muted={muted} setMuted={setMuted} isActive={true} />
    )
}

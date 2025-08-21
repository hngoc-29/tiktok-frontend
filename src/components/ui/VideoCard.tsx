"use client";
import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/VideoCard.module.css";
import VideoActions from "./VideoActions";
import VideoInfo from "./VideoInfo";
import type { User, Video } from "@/type/types";
import { useUser } from "@/contexts/UserContext";

type Props = {
    video: Video;
    author: User;
    autoPlayOnView?: boolean;
};

export default function VideoCard({ video, author, autoPlayOnView = true }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [muted, setMuted] = useState(true);
    const [playing, setPlaying] = useState(true);
    const { user } = useUser()

    useEffect(() => {
        if (!autoPlayOnView || !videoRef.current) return;
        const el = videoRef.current;
        const io = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.play().catch(() => { });
                    setPlaying(true);
                } else {
                    el.pause();
                    setPlaying(false);
                }
            },
            { threshold: 0.6 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [autoPlayOnView]);

    const togglePlay = () => {
        const v = videoRef.current;
        if (!v) return;
        if (v.paused) {
            v.play();
            setPlaying(true);
        } else {
            v.pause();
            setPlaying(false);
        }
    };

    const toggleMute = () => {
        const v = videoRef.current;
        if (!v) return;
        v.muted = !muted;
        setMuted(!muted);
    };

    return (
        <div className={styles.card}>
            <video
                ref={videoRef}
                className={styles.video}
                src={video.url}
                loop
                playsInline
                autoPlay
                muted={muted}
                onClick={togglePlay}
                poster={video.thumbnailUrl || undefined}
            />
            <div className={styles.overlay}>
                <VideoInfo author={author} title={video.title} music="Original sound" />
                <VideoActions
                    likeCount={video.likeCount}
                    commentCount={video.commentCount}
                    onToggleMute={toggleMute}
                    muted={muted}
                    videoId={video.id}
                    pathVideo={video.path}
                    isMe={user?.id === author?.id}
                />
            </div>
            {!playing && <div className={styles.tapHint}>Tap để phát</div>}
        </div>
    );
}

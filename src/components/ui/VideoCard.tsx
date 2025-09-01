import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/VideoCard.module.css";
import VideoActions from "./VideoActions";
import VideoInfo from "./VideoInfo";
import type { User, Video } from "@/type/types";
import { useUser } from "@/contexts/UserContext";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

type Props = {
    video: Video;
    author: User;
    autoPlayOnView?: boolean;
    muted: boolean;
    setMuted: (m: boolean) => void;
    isActive: boolean;
};

export default function VideoCard({ video, author, autoPlayOnView = true, muted, setMuted, isActive }: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const [playing, setPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const { user } = useUser();

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.muted = muted;
        }
    }, [muted]);

    const toggleMute = () => {
        setMuted(!muted);
    };

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

    // reset video khi đổi active
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;

        if (isActive) {
            v.play().catch(() => { });
            setPlaying(true);
        } else {
            v.pause();
            v.currentTime = 0;
            setProgress(0);
            setPlaying(false);
        }
    }, [isActive]);

    // cập nhật progress khi play
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const handleTimeUpdate = () => {
            const percent = (v.currentTime / v.duration) * 100;
            setProgress(percent || 0);
        };
        v.addEventListener("timeupdate", handleTimeUpdate);
        return () => v.removeEventListener("timeupdate", handleTimeUpdate);
    }, []);

    // khi kéo thanh tua
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = videoRef.current;
        if (!v) return;
        const newTime = (parseFloat(e.target.value) / 100) * v.duration;
        v.currentTime = newTime;
        setProgress(parseFloat(e.target.value));
    };

    return (
        <div 
            className={styles.card}
            onClick={togglePlay}
            >
            <video
                ref={videoRef}
                className={styles.video}
                src={video.url}
                loop
                playsInline
                autoPlay
                muted={muted}
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
                    title={video.title}
                    thumbnailUrl={video.thumbnailUrl || ``}
                />
                {/* Thanh tua */}
                <input
                    type="range"
                    min="0"
                    max="100"
                    step="0.1"
                    value={progress}
                    onChange={handleSeek}
                    className={styles.seekBar}
                    style={{
                        background: `linear-gradient(to right, white ${progress}%, rgba(255,255,255,0.3) ${progress}%)`
                    }}
                />
            </div>

            {/* Icon Play ở giữa khi pause */}
            {!playing && (
                <div
                    style={{
                        position: "absolute",
                        top: '280px',
                        left: "50%",
                        transform: "translateX(-50%)",
                        color: "white",
                        opacity: 0.8,
                        pointerEvents: "none",
                    }}
                >
                    <PlayArrowIcon sx={{ fontSize: 80 }} />
                </div>
            )}
        </div>
    );
}

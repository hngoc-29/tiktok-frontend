// VideoCard.tsx
import React, { useRef, useState, useEffect } from "react";
import styles from "./styles/VideoCard.module.css";
import VideoActions from "./VideoActions";
import VideoInfo from "./VideoInfo";
import type { User, Video } from "@/type/types";
import { useUser } from "@/contexts/UserContext";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FavoriteIcon from "@mui/icons-material/Favorite";

type Props = {
    video: Video;
    author: User;
    autoPlayOnView?: boolean;
    muted: boolean;
    setMuted: (m: boolean) => void;
    isActive: boolean;
};

export default function VideoCard({
    video,
    author,
    autoPlayOnView = true,
    muted,
    setMuted,
    isActive,
}: Props) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const containerRef = useRef<HTMLDivElement | null>(null);
    const clickTimeout = useRef<number | null>(null);

    const [playing, setPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const { user } = useUser();

    // Like state lifted here
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState<number>(video.likeCount || 0);

    // Heart animation state
    const [heart, setHeart] = useState<{ x: number; y: number; show: boolean }>({
        x: 0,
        y: 0,
        show: false,
    });

    // initial liked check (same endpoint as trước)
    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const res = await fetch(`/api/likes/video-user`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ videoId: video.id }),
                });
                const data = await res.json();
                if (!ignore) setLiked(Boolean(data.success ? data.data : false));
            } catch (err) {
                // ignore
            }
        })();
        return () => {
            ignore = true;
        };
    }, [video.id]);

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

    // reset video when active changes
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

    // update progress
    useEffect(() => {
        const v = videoRef.current;
        if (!v) return;
        const handleTimeUpdate = () => {
            const percent = (v.currentTime / (v.duration || 1)) * 100;
            setProgress(percent || 0);
        };
        v.addEventListener("timeupdate", handleTimeUpdate);
        return () => v.removeEventListener("timeupdate", handleTimeUpdate);
    }, []);

    // seek
    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = videoRef.current;
        if (!v) return;
        const newTime = (parseFloat(e.target.value) / 100) * v.duration;
        v.currentTime = newTime;
        setProgress(parseFloat(e.target.value));
    };

    // unified like handler (used by double click and by actions button)
    const handleToggleLike = async (isDouble = false) => {
        const path = !isDouble ? (liked ? "remove" : "add") : 'add';
        if(liked && isDouble) return;
        try {
            const res = await fetch(`/api/likes/${path}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videoId: video.id }),
            });
            const data = await res.json();
            if (!data.success) {
                // nếu lỗi, có thể show toast nhưng ở đây giữ đơn giản
                return;
            }
            // cập nhật UI
            setLiked(!liked);
            setLikes((s) => (path === "remove" ? s - 1 : s + 1));
        } catch (err) {
            console.error("Like error", err);
        }
    };

    // handle single vs double click:
    // single: togglePlay (delayed)
    // double: like + show heart (cancels single)
    const handleClickWrapper = (e: React.MouseEvent<HTMLDivElement>) => {
        // schedule single click action
        if (clickTimeout.current) {
            window.clearTimeout(clickTimeout.current);
            clickTimeout.current = null;
        }
        // set timeout to call togglePlay if no double click follows
        clickTimeout.current = window.setTimeout(() => {
            togglePlay();
            clickTimeout.current = null;
        }, 200); // 200ms threshold
    };

    const handleDoubleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        // cancel single click
        if (clickTimeout.current) {
            window.clearTimeout(clickTimeout.current);
            clickTimeout.current = null;
        }

        // compute position relative to container to place heart
        const container = containerRef.current;
        if (container) {
            const rect = container.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setHeart({ x, y, show: true });

            // hide heart after animation (animation defined in CSS)
            setTimeout(() => setHeart((h) => ({ ...h, show: false })), 900);
        }

        // perform like
        handleToggleLike(true);
    };

    return (
        <div
            ref={containerRef}
            className={styles.card}
            onClick={handleClickWrapper}
            onDoubleClick={handleDoubleClick}
            style={{ position: "relative" }}
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
                    likeCount={likes}
                    commentCount={video.commentCount}
                    onToggleMute={toggleMute}
                    muted={muted}
                    videoId={video.id}
                    pathVideo={video.path}
                    isMe={user?.id === author?.id}
                    title={video.title}
                    thumbnailUrl={video.thumbnailUrl || ``}
                    // lifted like props
                    liked={liked}
                    onToggleLike={handleToggleLike}
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
                        background: `linear-gradient(to right, white ${progress}%, rgba(255,255,255,0.3) ${progress}%)`,
                    }}
                />
            </div>

            {/* Center Play icon when paused */}
            {!playing && (
                <div
                    style={{
                        position: "absolute",
                        top: "280px",
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

            {/* Heart animation element */}
            {heart.show && (
                <div
                    className={styles.heartOverlay}
                    style={{ left: heart.x - 48, top: heart.y - 48 }} // center the heart (48 ~= half of heart size)
                >
                    <FavoriteIcon sx={{ fontSize: 96 }} />
                </div>
            )}
        </div>
    );
}
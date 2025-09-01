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

type Heart = { id: number; x: number; y: number };

export default function VideoCard({
  video,
  author,
  autoPlayOnView = true,
  muted,
  setMuted,
  isActive,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const clickTimerRef = useRef<number | null>(null);
  const clickCountRef = useRef<number>(0);

  const [playing, setPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const { user } = useUser();

  // Like state
  const [liked, setLiked] = useState(false);
  const [likes, setLikes] = useState<number>(video.likeCount || 0);
  const likePending = useRef(false); // cờ pending

  // multiple hearts
  const [hearts, setHearts] = useState<Heart[]>([]);
  const HEART_DURATION = 900; // ms
  const THRESHOLD = 250; // ms window để gom multi-click

  // check đã like chưa
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
      } catch {
        // ignore
      }
    })();
    return () => {
      ignore = true;
    };
  }, [video.id]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.muted = muted;
  }, [muted]);

  const toggleMute = () => setMuted(!muted);

  // auto play/pause theo viewport
  useEffect(() => {
    if (!autoPlayOnView || !videoRef.current) return;
    const el = videoRef.current;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.play().catch(() => {});
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

  // reset video khi chuyển active
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    if (isActive) {
      v.play().catch(() => {});
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

  // gửi like (chỉ add, dùng cho multi-click)
  const performLikeAdd = async () => {
    if (liked || likePending.current) return;
    likePending.current = true;
    try {
      const res = await fetch(`/api/likes/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: video.id }),
      });
      const data = await res.json();
      if (data.success) {
        setLiked(true);
        setLikes((s) => s + 1);
      }
    } catch (err) {
      console.error("Like add error", err);
    } finally {
      likePending.current = false;
    }
  };

  // nút like toggle
  const handleToggleLike = async () => {
    if (likePending.current) return;
    likePending.current = true;
    try {
      const path = liked ? "remove" : "add";
      const res = await fetch(`/api/likes/${path}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoId: video.id }),
      });
      const data = await res.json();
      if (data.success) {
        if (path === "add") {
          setLiked(true);
          setLikes((s) => s + 1);
        } else {
          setLiked(false);
          setLikes((s) => Math.max(0, s - 1));
        }
      }
    } catch (err) {
      console.error("Toggle like error", err);
    } finally {
      likePending.current = false;
    }
  };

  // tạo tim mới mỗi click
  const spawnHeart = (x: number, y: number) => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    const newHeart: Heart = { id, x, y };
    setHearts((h) => [...h, newHeart]);
    window.setTimeout(() => {
      setHearts((h) => h.filter((it) => it.id !== id));
    }, HEART_DURATION);
  };

  // xử lý click (single/multi)
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const container = containerRef.current;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    spawnHeart(x, y);
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      window.clearTimeout(clickTimerRef.current);
      clickTimerRef.current = null;
    }

    clickTimerRef.current = window.setTimeout(() => {
      const count = clickCountRef.current;
      if (count === 1) {
        togglePlay();
      } else {
        performLikeAdd();
      }
      clickCountRef.current = 0;
      if (clickTimerRef.current) {
        window.clearTimeout(clickTimerRef.current);
        clickTimerRef.current = null;
      }
    }, THRESHOLD);
  };

  return (
    <div
      ref={containerRef}
      className={styles.card}
      onClick={handleClick}
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
          liked={liked}
          onToggleLike={handleToggleLike}
        />
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

      {hearts.map((h) => (
        <div
          key={h.id}
          className={styles.heartOverlay}
          style={{ left: h.x - 48, top: h.y - 48 }}
        >
          <FavoriteIcon sx={{ fontSize: 96 }} />
        </div>
      ))}
    </div>
  );
}

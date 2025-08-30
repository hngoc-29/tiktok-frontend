"use client";

import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import VideoCard from "./ui/VideoCard";
import { VideoContext } from "@/contexts/VideoContext";
import { User, Video } from "@/type/types";

export default function Feed() {
    const { videos, setVideos, authors, setAuthors, scrollIndex, setScrollIndex } = useContext(VideoContext);
    const [loading, setLoading] = useState(videos.length === 0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [hasMore, setHasMore] = useState(true);   // 👈 thêm
    const [currentIndex, setCurrentIndex] = useState(scrollIndex || 0);
    const [muted, setMuted] = useState(true);

    const containerRef = useRef<HTMLDivElement>(null);
    const excludeIdsRef = useRef<Set<number>>(new Set(videos.map(v => v.id)));
    const loadingRef = useRef(false);
    const readyToLoadRef = useRef(false);

    // Fetch videos mới
    const fetchVideos = useCallback(async () => {
        if (loadingRef.current || !hasMore) return; // 👈 nếu hết video thì không fetch nữa
        loadingRef.current = true;
        setLoadingMore(true);

        try {
            const excludeIds = Array.from(excludeIdsRef.current).join(",");
            const res = await fetch(`/api/video/random?limit=10&excludeIds=${excludeIds}`);
            const data = await res.json();

            if (!Array.isArray(data) || data.length === 0) {
                setHasMore(false);  // 👈 đánh dấu đã hết video
                return;
            }

            const users: { [key: number]: User } = { ...authors };
            await Promise.all(
                data.map(async (v: Video) => {
                    excludeIdsRef.current.add(v.id);
                    if (!users[v.userId]) {
                        const resUser = await fetch(`/api/user/info?userId=${v.userId}`);
                        const userData = await resUser.json();
                        if (userData.success) {
                            users[v.userId] = userData.user;
                        }
                    }
                })
            );

            setAuthors(users);
            setVideos(prev => [...prev, ...data]);
        } catch (err) {
            console.error("Error fetching videos:", err);
        } finally {
            setLoading(false);
            setLoadingMore(false);
            loadingRef.current = false;
            readyToLoadRef.current = false;
        }
    }, [authors, setVideos, setAuthors, hasMore]);

    // Load batch đầu tiên nếu context trống
    useEffect(() => {
        if (videos.length === 0) fetchVideos();
    }, [fetchVideos, videos.length]);

    // Khi mount Feed, scroll về video trước đó
    useEffect(() => {
        if (containerRef.current && scrollIndex > 0) {
            containerRef.current.scrollTo({
                top: scrollIndex * containerRef.current.clientHeight,
                behavior: "auto",
            });
        }
    }, [scrollIndex]);

    // Scroll handler
    const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

const handleScroll = useCallback(() => {
    if (!containerRef.current) return;
    const { scrollTop, clientHeight } = containerRef.current;

    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);

    scrollTimeout.current = setTimeout(() => {
        const index = Math.round(scrollTop / clientHeight);

        setCurrentIndex(index);
        setScrollIndex(index);

        if (index === videos.length - 1) {
            if (readyToLoadRef.current && !loadingRef.current) {
                fetchVideos();
            } else {
                readyToLoadRef.current = true;
            }
        }
    }, 100);
}, [videos.length, fetchVideos, setScrollIndex]);

    useEffect(() => {
        const el = containerRef.current;
        if (!el) return;
        el.addEventListener("scroll", handleScroll);
        return () => el.removeEventListener("scroll", handleScroll);
    }, [handleScroll]);

    if (loading) {
        return (
            <div style={{
                display: "flex", position: "fixed", background: "#000", color: "#fff",
                top: 0, bottom: 0, right: 0, left: 0, alignItems: "center",
                flexDirection: "column", zIndex: 100
            }}>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginTop: '280px' }}>
                    <div style={{
                        border: "4px solid rgba(255,255,255,0.2)",
                        borderTop: "4px solid #fff",
                        borderRadius: "50%", width: "48px", height: "48px",
                        animation: "spin 1s linear infinite"
                    }} />
                    <p style={{ marginTop: 16 }}>Đang tải video...</p>
                </div>
                <style>{`@keyframes spin{0%{transform:rotate(0deg);}100%{transform:rotate(360deg);}}`}</style>
            </div>
        );
    }

    return (
        <div
            ref={containerRef}
            style={{
                height: "100vh", width: "100%", overflowY: "scroll",
                scrollSnapType: "y mandatory", background: "#000", paddingBottom: 56,
            }}
        >
            {videos.map((v, i) => (
                <div key={v.id} style={{ scrollSnapAlign: "start" }}>
                    {authors[v.userId] ? (
                        <VideoCard
                            video={v}
                            author={authors[v.userId]}
                            muted={muted}
                            setMuted={setMuted}
                            isActive={i === currentIndex}
                        />
                    ) : (
                        <div style={{ color: "#fff" }}>Đang tải user...</div>
                    )}
                </div>
            ))}

            {loadingMore && hasMore && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: "20px", color: "#fff" }}>
                    <div style={{
                        border: "3px solid rgba(255,255,255,0.2)",
                        borderTop: "3px solid #fff",
                        borderRadius: "50%", width: "28px", height: "28px",
                        marginRight: "10px", animation: "spin 1s linear infinite"
                    }} />
                    <span>Đang tải thêm...</span>
                </div>
            )}

            {!hasMore && (
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: "40px 20px",
                        color: "#fff",
                        textAlign: "center",
                        opacity: 0.8,
                    }}
                >
                    <div
                        style={{
                            fontSize: "36px",
                            marginBottom: "12px",
                        }}
                    >
                        🎬
                    </div>
                    <div
                        style={{
                            fontSize: "18px",
                            fontWeight: "bold",
                            marginBottom: "8px",
                        }}
                    >
                        Hết video rồi!
                    </div>
                    <div
                        style={{
                            fontSize: "14px",
                            color: "#aaa",
                        }}
                    >
                        Hãy quay lại sau để xem thêm nội dung mới nhé 👌
                    </div>
                </div>
            )}
        </div>
    );
}

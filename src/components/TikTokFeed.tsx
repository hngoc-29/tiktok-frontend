"use client";

import React, { useEffect, useState, useRef, useCallback, useContext } from "react";
import VideoCard from "./ui/VideoCard";
import { VideoContext } from "@/contexts/VideoContext";
import { User, Video } from "@/type/types";

export default function Feed() {
    const { videos, setVideos, authors, setAuthors, scrollIndex, setScrollIndex } = useContext(VideoContext);
    const [loading, setLoading] = useState(videos.length === 0);
    const [loadingMore, setLoadingMore] = useState(false);
    const [currentIndex, setCurrentIndex] = useState(scrollIndex || 0);

    const containerRef = useRef<HTMLDivElement>(null);
    const excludeIdsRef = useRef<Set<number>>(new Set(videos.map(v => v.id)));
    const loadingRef = useRef(false);
    const readyToLoadRef = useRef(false);

    // Fetch videos mới
    const fetchVideos = useCallback(async () => {
        if (loadingRef.current) return;
        loadingRef.current = true;
        setLoadingMore(true);

        try {
            const excludeIds = Array.from(excludeIdsRef.current).join(",");
            const res = await fetch(`/api/video/random?limit=10&excludeIds=${excludeIds}`);
            const data = await res.json();

            if (!Array.isArray(data) || data.length === 0) return;

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
    }, [authors, setVideos, setAuthors]);

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

        // chỉ snap sau khi user dừng kéo 100ms
        scrollTimeout.current = setTimeout(() => {
            const index = Math.round(scrollTop / clientHeight);

            containerRef.current?.scrollTo({
                top: index * clientHeight,
                behavior: "smooth",
            });

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
        return <div style={{ color: "#fff", textAlign: "center" }}>Đang tải...</div>;
    }

    return (
        <div
            ref={containerRef}
            style={{
                height: "100vh",
                width: "100%",
                overflowY: "scroll",
                scrollSnapType: "y mandatory",
                background: "#000",
                paddingBottom: 56,
            }}
        >
            {videos.map((v) => (
                <div key={v.id} style={{ scrollSnapAlign: "start" }}>
                    {authors[v.userId] ? (
                        <VideoCard video={v} author={authors[v.userId]} />
                    ) : (
                        <div style={{ color: "#fff" }}>Đang tải user...</div>
                    )}
                </div>
            ))}

            {loadingMore && (
                <div style={{ color: "#fff", textAlign: "center" }}>Đang tải thêm...</div>
            )}
        </div>
    );
}

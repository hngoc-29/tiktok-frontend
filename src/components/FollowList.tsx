"use client";

import { useEffect, useState, useRef, useCallback, SyntheticEvent } from "react";
import { Button, Typography, CircularProgress, Tabs, Tab } from "@mui/material";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./styles/FollowList.module.css";
import Link from "next/link";

export interface User {
    id: number;
    username: string;
    fullname: string;
    avatarUrl?: string;
    followersCount: number;
    followingCount: number;
    isFollowing: boolean; // Tôi có follow người này chưa
}

export default function FollowListPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryTab = searchParams.get("tab") as "followers" | "following" | null;

    const [tab, setTab] = useState<"followers" | "following">(queryTab || "followers");
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [updating, setUpdating] = useState<number | null>(null);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    const skipRef = useRef(skip);
    const hasMoreRef = useRef(hasMore);
    const containerRef = useRef<HTMLDivElement>(null);
    const take = 10;

    useEffect(() => { skipRef.current = skip; }, [skip]);
    useEffect(() => { hasMoreRef.current = hasMore; }, [hasMore]);

    // update tab từ query param
    useEffect(() => {
        if (queryTab && queryTab !== tab) {
            setTab(queryTab);
            setUsers([]);
            setSkip(0);
            setHasMore(true);
        }
    }, [queryTab]);

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

    const fetchUsers = async (skipValue: number) => {
        if (!hasMoreRef.current) return;
        setLoading(true);
        try {
            const res = await fetch(`/api/follow/get${capitalize(tab)}?skip=${skipValue}&take=${take}`);
            const data = await res.json();
            if (data.success) {
                if (data.data.length < take) setHasMore(false);
                setUsers(prev => [...prev, ...data.data]);
                setSkip(skipValue + take);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleFollowToggle = async (userId: number, unfollow: boolean) => {
        setUpdating(userId);
        try {
            const res = await fetch(`/api/follow/${unfollow ? "unfollowUser" : "followUser"}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ followingId: userId }),
            });
            const data = await res.json();
            if (data.success) {
                setUsers([]);
                setSkip(0);
                setHasMore(true);
                fetchUsers(0);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setUpdating(null);
        }
    };

    const handleTabChange = (
        _: SyntheticEvent,
        newValue: "followers" | "following"
    ) => {
        setTab(newValue);
        router.push(`/user/followers?tab=${newValue}`, { scroll: false });
        setUsers([]);
        setSkip(0);
        setHasMore(true);
    };

    const handleScroll = useCallback(() => {
        if (!containerRef.current || loading || !hasMoreRef.current) return;
        const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
        if (scrollTop + clientHeight >= scrollHeight - 10) {
            fetchUsers(skipRef.current);
        }
    }, [loading, tab]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;
        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [handleScroll, tab]);

    useEffect(() => { fetchUsers(0); }, [tab]);

    return (
        <div className={styles.wrapper}>
            <Tabs value={tab} onChange={handleTabChange} centered>
                <Tab label="Followers" value="followers" />
                <Tab label="Following" value="following" />
            </Tabs>

            <div
                ref={containerRef}
                className={styles.container}
                style={{ height: "90vh", overflowY: "auto" }}
            >
                {users.length === 0 && !loading ? (
                    <Typography align="center" style={{ marginTop: "2rem" }}>
                        Không có người dùng nào
                    </Typography>
                ) : (
                    users.map((user, index) => {
                        const buttonText =
                            tab === "followers"
                                ? user.isFollowing ? "Unfollow" : "Follow"
                                : "Unfollow";

                        const buttonVariant = buttonText === "Follow" ? "contained" : "outlined";
                        const buttonColor = buttonText === "Follow" ? "primary" : "secondary";

                        return (
                            <Link
                                href={`/user/` + user.username}
                                key={index}   // 🔥 đổi từ user.id sang index
                                className={styles.userCard}
                            >
                                <div className={styles.userInfo}>
                                    <img
                                        src={user.avatarUrl || "/default-avatar.png"}
                                        alt={user.username}
                                        className={styles.avatar}
                                    />
                                    <div className={styles.userText}>
                                        <span className={styles.fullname}>{user.fullname}</span>
                                        <span className={styles.username}>@{user.username}</span>
                                        <span className={styles.stats}>
                                            {user.followersCount} Followers • {user.followingCount} Following
                                        </span>
                                    </div>
                                </div>
                                <Button
                                    variant={buttonVariant}
                                    color={buttonColor}
                                    size="small"
                                    disabled={updating === user.id}
                                    onClick={(e) => {
                                        e.preventDefault(); // chặn Link điều hướng
                                        e.stopPropagation(); // chặn click lan ra ngoài
                                        handleFollowToggle(user.id, buttonText === "Unfollow");
                                    }}
                                >
                                    {buttonText}
                                </Button>
                            </Link>
                        );
                    })

                )}

                {loading && (
                    <div style={{ display: "flex", justifyContent: "center", padding: "1rem" }}>
                        <CircularProgress size={24} color="primary" />
                    </div>
                )}

                {!hasMore && users.length > 0 && (
                    <Typography align="center" style={{ margin: "1rem 0", color: "#666" }}>
                        Đã hết dữ liệu
                    </Typography>
                )}
            </div>
        </div>
    );
}

"use client";
import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import { toast } from "react-toastify";

interface FollowButtonProps {
    userId: number | null;
    initialIsFollowing: boolean;
    initialFollowers: number | null;
}

export default function FollowButton({ userId, initialIsFollowing, initialFollowers }: FollowButtonProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [followers, setFollowers] = useState(initialFollowers);

    const handleFollow = async () => {
        const url = `/api/follow/${isFollowing ? "unfollowUser" : "followUser"}?userId=${userId}`;
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ followingId: userId })
        });
        const data = await res.json();

                    if(data.success===false || data.error) toast.error(data.message);
        if (data.success) {
            setIsFollowing(!isFollowing);
            setFollowers(prev => prev !== null ? prev + (isFollowing ? -1 : 1) : prev);
        }
    }

    return (
        <Button
            variant={isFollowing ? "outlined" : "contained"} // Unfollow = outlined, Follow = contained
            color="primary"
            size="small"
            onClick={handleFollow}
            sx={{
                textTransform: "none", // chữ thường
                minWidth: 100,
                borderRadius: "18px",
                fontWeight: 500,
                fontSize: "0.9rem",
                backgroundColor: isFollowing ? "white" : "#1976d2", // tuỳ chỉnh màu theo variant
                color: isFollowing ? "#1976d2" : "white",
                "&:hover": {
                    backgroundColor: isFollowing ? "#f5f5f5" : "#1565c0"
                }
            }}
        >
            {isFollowing ? "Unfollow" : "Follow"}
        </Button>
    );
}

"use client";
import React from "react";
import styles from "./styles/VideoInfo.module.css";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { useUser } from "@/contexts/UserContext";

import type { User } from "@/type/types";
import Link from "next/link";

type Props = {
    author: User;
    title: string;
    music: string;
};

export default function VideoInfo({ author, title, music }: Props) {
    const { user } = useUser();
    return (
        <div className={styles.infoWrap} onClick={(e) => e.stopPropagation()}>
            <div className={styles.gradient} />
            <div className={styles.info}>
                <div className={styles.authorLine}>
                    <img
                        className={styles.avatar}
                        src={author?.avatarUrl || "/placeholder-avatar.png"}
                        alt={author?.username}
                    />
                    <Link href={`/user/${author.username}`}><span className={styles.username}>@{author?.username}</span></Link>
                </div>

                <div className={styles.title}>{title}</div>

                <div className={styles.music}>
                    <MusicNoteIcon sx={{ fontSize: 16 }} />
                    <span>{music}</span>
                </div>
            </div>
        </div>
    );
}

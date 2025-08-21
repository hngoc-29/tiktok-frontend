"use client"

import React, { useEffect, useState } from 'react'
import FavoriteBorderOutlinedIcon from '@mui/icons-material/FavoriteBorderOutlined';
import ArticleOutlinedIcon from '@mui/icons-material/ArticleOutlined';
import { UserType } from '@/type/User';

import styles from './styles/ProfileVideo.module.css';
import CardVideo from './CardVideo';

export default function ProfileVideo({ user, isMe = false }: { user: UserType, isMe: boolean }) {
    const [select, setSelect] = useState("video");
    const [videos, setVideos] = useState([]);
    useEffect(() => {
        const fetchVideo = async () => {
            if (select === `like`) {
                const res = await fetch(`/api/video/like`, {
                    credentials: "include",
                });
                const data = await res.json();
                if (data.success) setVideos(data.data);
                else setVideos([]);
            } else {
                const res = await fetch(`/api/video/user?userId=${user.id}`, {});
                const data = await res.json();
                if (data.success) setVideos(data.videos);
                else setVideos([]);
            }
        }
        fetchVideo();
    }, [select])

    return (
        <div>
            <div className={styles.wrapper}>
                <div className={select === "video" ? styles.active : ''} onClick={() => setSelect(`video`)}>
                    <ArticleOutlinedIcon fontSize={`large`} color={select === "video" ? 'error' : 'inherit'} />
                </div>
                {isMe && <div className={select === "like" ? styles.active : ''} onClick={() => setSelect(`like`)}>
                    <FavoriteBorderOutlinedIcon fontSize={`large`} color={select === "like" ? `error` : `inherit`} />
                </div>}
            </div>
            <div className={styles.grid}>
                {videos.map((item, index) => (
                    <CardVideo
                        key={index}
                        video={item}
                    />
                ))}
            </div>
        </div>
    )
}

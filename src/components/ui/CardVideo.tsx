import { VideoType } from '@/type/Video'
import React from 'react'
import styles from './styles/CardVideo.module.css'
import Link from 'next/link'

export default function CardVideo({ video }: { video: VideoType }) {
    return (
        <Link className={styles.wrapper} href={`/video/${video.path}`}>
            <img src={video?.thumbnailUrl} className={styles.thumbnail} />
            <span className={styles.title}>{video.title}</span>
            <span className={styles.container}></span>
        </Link>
    )
}

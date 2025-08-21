// ShareActions.tsx
"use client";
import React, { useState } from "react";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FacebookIcon from "@mui/icons-material/Facebook";
import styles from "./styles/VideoActions.module.css";

type Props = {
    videoId: number;
};

export default function ShareActions({ videoId }: Props) {
    const [copied, setCopied] = useState(false);

    const videoUrl = `${window.location.origin}/video/${videoId}`;

    const handleCopy = () => {
        navigator.clipboard.writeText(videoUrl).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    };

    const handleShareFacebook = () => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`;
        window.open(fbUrl, "_blank", "width=600,height=400");
    };

    return (
        <div className={styles.shareActions}>
            <div className={styles.action} onClick={handleShareFacebook} role="button">
                <FacebookIcon sx={{ fontSize: 28, color: "#1877f2" }} />
                <span>Facebook</span>
            </div>

            <div className={styles.action} onClick={handleCopy} role="button">
                <ContentCopyIcon sx={{ fontSize: 28 }} />
                <span>{copied ? "Copied!" : "Copy Link"}</span>
            </div>
        </div>
    );
}

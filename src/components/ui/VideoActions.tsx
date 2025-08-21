"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import FacebookIcon from "@mui/icons-material/Facebook";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import ChatDrawer from "./ChatDrawer";
import styles from "./styles/VideoActions.module.css";
import { toast } from "react-toastify";

import {
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    Button,
} from "@mui/material";

type Props = {
    likeCount: number;
    commentCount: number;
    onToggleMute: () => void;
    muted: boolean;
    videoId: number;
    pathVideo: string;
    isMe: boolean;
};

export default function VideoActions({
    likeCount,
    commentCount,
    onToggleMute,
    muted,
    videoId,
    pathVideo,
    isMe,
}: Props) {
    const [liked, setLiked] = useState(false);
    const [likes, setLikes] = useState(likeCount)
    const [comments, setComments] = useState(commentCount)
    const [openChat, setOpenChat] = useState(false);
    const [openShare, setOpenShare] = useState(false);
    const [copied, setCopied] = useState(false);
    const [openConfirm, setOpenConfirm] = useState(false); // 👈 state cho Dialog
    const router = useRouter();
    const [videoUrl, setVideoUrl] = useState("");


    useEffect(() => {
        if (typeof window !== "undefined") {
            setVideoUrl(`${window.location.origin}/video/${pathVideo}`);
        }
    }, [pathVideo]);

    useEffect(() => {
        let ignore = false;
        (async () => {
            const res = await fetch(`/api/likes/video-user`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ videoId }),
            });
            const data = await res.json();
            if (!ignore) setLiked(data.success ? data.data : false);
        })();
        return () => {
            ignore = true;
        };
    }, [videoId]);

    const handleClickLike = async (path: string) => {
        const res = await fetch(`/api/likes/${path}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ videoId }),
        });
        const data = await res.json();
        if (data.success) {
            setLiked(!liked);
            setLikes(path === `remove` ? likes - 1 : likes + 1);
        }
    };

    const handleCopy = () => {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(videoUrl).then(() => {
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            });
        } else {
            const textArea = document.createElement("textarea");
            textArea.value = videoUrl;
            textArea.style.position = "fixed";
            textArea.style.opacity = "0";
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            try {
                document.execCommand("copy");
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            } catch (err) {
                console.error("Fallback: copy failed", err);
            }
            document.body.removeChild(textArea);
        }
    };

    const handleShareFacebook = () => {
        const fbUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            videoUrl
        )}`;
        window.open(fbUrl, "_blank", "width=600,height=400");
    };

    const confirmDelete = async () => {
        const res = await fetch(`/api/video/delete?videoId=${videoId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });
        const data = await res.json();
        if (data.success) {
            toast.success("Xóa video thành công!");
            router.back();
        } else {
            toast.error(data.message || "Xóa video thất bại!");
        }
        setOpenConfirm(false);
    };

    return (
        <>
            <div className={styles.actions}>
                <div
                    className={styles.action}
                    onClick={() => handleClickLike(liked ? "remove" : "add")}
                    role="button"
                >
                    {liked ? (
                        <FavoriteIcon sx={{ fontSize: 30, color: "red" }} />
                    ) : (
                        <FavoriteBorderIcon sx={{ fontSize: 30 }} />
                    )}
                    <span>{likes}</span>
                </div>

                <div
                    className={styles.action}
                    role="button"
                    onClick={() => setOpenChat(true)}
                >
                    <ChatBubbleOutlineIcon sx={{ fontSize: 30 }} />
                    <span>{comments}</span>
                </div>

                <div
                    className={styles.action}
                    role="button"
                    onClick={() => setOpenShare(true)}
                >
                    <ShareOutlinedIcon sx={{ fontSize: 30 }} />
                    <span>Chia sẻ</span>
                </div>

                <div className={styles.action} onClick={onToggleMute} role="button">
                    {muted ? (
                        <VolumeOffIcon sx={{ fontSize: 28 }} />
                    ) : (
                        <VolumeUpIcon sx={{ fontSize: 28 }} />
                    )}
                </div>

                {isMe && (
                    <div
                        className={styles.action}
                        role="button"
                        onClick={() => setOpenConfirm(true)}
                    >
                        <DeleteOutlineIcon sx={{ fontSize: 28, color: "red" }} />
                        <span>Xóa</span>
                    </div>
                )}
            </div>

            <ChatDrawer
                open={openChat}
                onClose={() => setOpenChat(false)}
                videoId={videoId}
                commentCount={comments}
                setCommentCount={setComments}
            />

            {/* Share Modal */}
            {openShare && (
                <div
                    className={styles.shareModalBackdrop}
                    onClick={() => setOpenShare(false)}
                >
                    <div
                        className={styles.shareModal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.shareOption} onClick={handleShareFacebook}>
                            <FacebookIcon sx={{ fontSize: 28, color: "#1877f2" }} />
                            <span>Facebook</span>
                        </div>
                        <div className={styles.shareOption} onClick={handleCopy}>
                            <ContentCopyIcon sx={{ fontSize: 28 }} />
                            <span>{copied ? "Copied!" : "Copy Link"}</span>
                        </div>
                        <div
                            className={styles.shareOption}
                            onClick={() => setOpenShare(false)}
                        >
                            <span>Đóng</span>
                        </div>
                    </div>
                </div>
            )}

            {/* MUI Confirm Dialog */}
            <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
                <DialogTitle>Xác nhận xóa</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Bạn có chắc chắn muốn xóa video này? Hành động này không thể hoàn
                        tác.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirm(false)} color="inherit">
                        Hủy
                    </Button>
                    <Button onClick={confirmDelete} color="error" autoFocus>
                        Xóa
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}

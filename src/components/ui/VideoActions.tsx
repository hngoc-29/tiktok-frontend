// VideoActions.tsx
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
import EditIcon from "@mui/icons-material/Edit";
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
  TextField,
} from "@mui/material";

type Props = {
  likeCount: number;
  commentCount: number;
  onToggleMute: () => void;
  muted: boolean;
  videoId: number;
  pathVideo: string;
  isMe: boolean;
  title: string;
  thumbnailUrl?: string;
  // new props from parent
  liked: boolean;
  onToggleLike: () => void;
};

export default function VideoActions({
  likeCount,
  commentCount,
  onToggleMute,
  muted,
  videoId,
  pathVideo,
  isMe,
  title,
  thumbnailUrl,
  liked,
  onToggleLike,
}: Props) {
  const [comments, setComments] = useState(commentCount);
  const [openChat, setOpenChat] = useState(false);
  const [openShare, setOpenShare] = useState(false);
  const [copied, setCopied] = useState(false);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openUpdate, setOpenUpdate] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newThumb, setNewThumb] = useState<File | null>(null);
  const [thumbURL, setThumbURL] = useState("");

  const router = useRouter();
  const [videoUrl, setVideoUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setVideoUrl(`${window.location.origin}/video/${pathVideo}`);
    }
  }, [pathVideo]);

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

  // Preview thumb mới
  useEffect(() => {
    if (!newThumb) return;
    const url = URL.createObjectURL(newThumb);
    setThumbURL(url);
    return () => URL.revokeObjectURL(url);
  }, [newThumb]);

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("title", newTitle);
    formData.append("id", String(videoId));
    if (newThumb) formData.append("fileThumbnail", newThumb);

    try {
      const res = await fetch(`/api/video/update`, {
        method: "PUT",
        body: formData,
      });
      const data = await res.json();
      if (!res.ok || !data?.success) {
        throw new Error(data?.message || "Update thất bại");
      }
      toast.success("Cập nhật thành công!");
      setOpenUpdate(false);
      router.refresh?.();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  return (
    <>
      <div className={styles.actions} onClick={(e) => e.stopPropagation()}>
        <div className={styles.action} onClick={() => onToggleLike()} role="button">
          {liked ? (
            <FavoriteIcon sx={{ fontSize: 30, color: "red" }} />
          ) : (
            <FavoriteBorderIcon sx={{ fontSize: 30 }} />
          )}
          <span>{likeCount}</span>
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
          <>
            <div
              className={styles.action}
              role="button"
              onClick={() => {
                setNewTitle(title);
                setThumbURL(thumbnailUrl || "");
                setNewThumb(null);
                setOpenUpdate(true);
              }}
            >
              <EditIcon sx={{ fontSize: 28, color: "orange" }} />
              <span>Sửa</span>
            </div>

            <div
              className={styles.action}
              role="button"
              onClick={() => setOpenConfirm(true)}
            >
              <DeleteOutlineIcon sx={{ fontSize: 28, color: "red" }} />
              <span>Xóa</span>
            </div>
          </>
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
          <div className={styles.shareModal} onClick={(e) => e.stopPropagation()}>
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

      {/* Confirm Delete */}
      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle>Xác nhận xóa</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Bạn có chắc chắn muốn xóa video này? Hành động này không thể hoàn tác.
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

      {/* Update Video */}
      <Dialog open={openUpdate} onClose={() => setOpenUpdate(false)} fullWidth sx={{ zIndex: 10000 }}>
        <DialogTitle>Cập nhật video</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1, zIndex: 10000 }}
        >
          <TextField
            label="Tiêu đề"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            fullWidth
          />
          <input
            accept="image/*"
            type="file"
            id="updateThumb"
            style={{ display: "none" }}
            onChange={(e) => setNewThumb(e.target.files?.[0] || null)}
          />
          <label htmlFor="updateThumb">
            <Button variant="outlined" component="span" fullWidth>
              {newThumb ? `Đã chọn: ${newThumb.name}` : "Chọn thumbnail mới"}
            </Button>
          </label>
          {(thumbURL || thumbnailUrl) && (
            <img
              src={thumbURL || thumbnailUrl}
              alt="Thumbnail preview"
              style={{ width: "100%", borderRadius: 8 }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenUpdate(false)}>Hủy</Button>
          <Button onClick={handleUpdate} variant="contained">
            Cập nhật
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

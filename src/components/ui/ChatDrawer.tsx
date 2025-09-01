"use client";

import {
    Drawer,
    Box,
    Typography,
    TextField,
    Button,
    Avatar,
    IconButton,
    CircularProgress,
} from "@mui/material";
import { useEffect, useState, useRef, Dispatch, SetStateAction } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useUser } from "@/contexts/UserContext";
import { toast } from "react-toastify";

interface User {
    id: number;
    fullname: string;
    avatarUrl?: string;
}

interface Comment {
    id: number;
    content: string;
    createdAt: string;
    user: User;
}

interface ChatDrawerProps {
    open: boolean;
    onClose: () => void;
    videoId: number;
    commentCount: number;
    setCommentCount: Dispatch<SetStateAction<number>>;
}

const TAKE = 10; // số comment mỗi lần lấy

export default function ChatDrawer({
    open,
    onClose,
    videoId,
    commentCount,
    setCommentCount
}: ChatDrawerProps) {
    const [message, setMessage] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

    const { user } = useUser();
    const currentUserId = user?.id;
    const listRef = useRef<HTMLDivElement>(null);

    // fetch comments lần đầu khi open
    useEffect(() => {
        if (!open) return;

        setComments([]);
        setSkip(0);
        setHasMore(true);
        fetchComments(0);
    }, [open, videoId]);

    const fetchComments = async (skipValue: number) => {
        if (loading) return;
        setLoading(true);

        try {
            const res = await fetch(
                `/api/comments?videoId=${videoId}&skip=${skipValue}&take=${TAKE}`
            );
            const data: Comment[] = await res.json();

            if (data.length < TAKE) {
                setHasMore(false); // không còn dữ liệu nữa
            }

            if (skipValue === 0) {
                setComments(data);
            } else {
                setComments(prev => [...prev, ...data]);
            }

            setSkip(skipValue + TAKE);
        } catch (err) {
            console.error("Lỗi fetch comments:", err);
        } finally {
            setLoading(false);
        }
    };

    // scroll infinite
    const handleScroll = () => {
        const el = listRef.current;
        if (!el || loading || !hasMore) return;

        const { scrollTop, scrollHeight, clientHeight } = el;
        if (scrollTop + clientHeight >= scrollHeight - 50) {
            fetchComments(skip);
        }
    };

    const handleSend = async () => {
        if (!message.trim()) return;

        const res = await fetch(`/api/comments?videoId=${videoId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ content: message }),
        });

        const data = await res.json();

        if (data.success === false || data.error) {
            toast.error(data.message || "Gửi comment thất bại!");
            return;
        }

        // Tự build comment mới bằng user context + nội dung vừa gửi
        const newComment: Comment = {
            ...data.data, // id, createdAt... lấy từ API
            content: message,
            user: {
                id: user!.id,
                fullname: user!.fullname,
                avatarUrl: user?.avatarUrl,
            },
        };

        setCommentCount(commentCount + 1);
        setComments((prev) => [newComment, ...prev]);
        setMessage("");
    };



    const handleDelete = async (id: number) => {
        try {
            const res = await fetch(`/api/comments?commentId=${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!data.success) return toast.error(data.message);
            setCommentCount(commentCount - 1);
            setComments(prev => prev.filter(c => c.id !== id));
        } catch (err) {
            console.error("Lỗi xóa comment:", err);
        }
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <Drawer
                anchor="right"
                open={open}
                onClose={onClose}
                PaperProps={{
                    sx: { width: 360, bgcolor: "#111", color: "#fff" },
                }}
                ModalProps={{
                    disableEnforceFocus: true,
                    disableAutoFocus: true,
                    keepMounted: true,
                }}
            >
                <Box p={2} display="flex" flexDirection="column" height="100%">
                    {/* Header */}
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6">💬 Bình luận</Typography>
                        <IconButton onClick={onClose} sx={{ color: "#fff" }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>

                    {/* Danh sách comment */}
                    <Box
                        ref={listRef}
                        flex={1}
                        onScroll={handleScroll}
                        sx={{
                            overflowY: "auto",
                            border: "1px solid rgba(255,255,255,0.1)",
                            borderRadius: 2,
                            p: 1,
                            mb: 2,
                        }}
                    >
                        {comments.length === 0 && !loading ? (
                            <Typography variant="body2" sx={{ opacity: 0.6 }}>
                                Chưa có bình luận nào.
                            </Typography>
                        ) : (
                            comments.map((cmt, idx) => (
                                <Box
                                    key={idx}
                                    display="flex"
                                    gap={1.5}
                                    mb={2}
                                    sx={{ alignItems: "flex-start" }}
                                >
                                    <Avatar
                                        src={cmt?.user?.avatarUrl || "/default-avatar.png"}
                                        sx={{ width: 32, height: 32 }}
                                    />
                                    <Box flex={1}>
                                        <Box display="flex" justifyContent="space-between" alignItems="center">
                                            <Box>
                                                <Typography variant="subtitle2">{cmt?.user?.fullname}</Typography>
                                                <Typography
                                                    variant="caption"
                                                    sx={{ opacity: 0.6 }}
                                                >
                                                    {new Date(cmt.createdAt).toLocaleString()}
                                                </Typography>
                                            </Box>

                                            {Number(cmt?.user?.id) === Number(currentUserId) && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => handleDelete(cmt.id)}
                                                    sx={{ color: "rgba(255,255,255,0.6)" }}
                                                >
                                                    <DeleteOutlineIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </Box>

                                        <Typography
                                            variant="body2"
                                            sx={{
                                                mt: 0.5,
                                                bgcolor: "rgba(255,255,255,0.08)",
                                                p: 1,
                                                borderRadius: 1,
                                            }}
                                        >
                                            {cmt?.content}
                                        </Typography>
                                    </Box>
                                </Box>
                            ))
                        )}

                        {/* Loading spinner */}
                        {loading && (
                            <Box display="flex" justifyContent="center" p={2}>
                                <CircularProgress size={24} sx={{ color: "#fff" }} />
                            </Box>
                        )}

                        {!hasMore && comments.length > 0 && (
                            <Typography variant="body2" align="center" sx={{ opacity: 0.5, mt: 1 }}>
                                Đã tải hết bình luận.
                            </Typography>
                        )}
                    </Box>

                    {/* Input chat */}
                    <Box display="flex" gap={1}>
                        <TextField
                            fullWidth
                            size="small"
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            placeholder="Viết bình luận..."
                            variant="outlined"
                            sx={{
                                input: { color: "#fff" },
                                fieldset: { borderColor: "rgba(255,255,255,0.2)" },
                            }}
                        />
                        <Button
                            variant="contained"
                            onClick={handleSend}
                            sx={{ bgcolor: "#ff0050", "&:hover": { bgcolor: "#e60045" } }}
                        >
                            Gửi
                        </Button>
                    </Box>
                </Box>
            </Drawer>
        </div>
    );
}

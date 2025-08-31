"use client";

import { useEffect, useMemo, useState } from "react";
import styles from "./CreateVideo.module.css";
import {
    Box,
    Button,
    Container,
    Paper,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import { toast } from "react-toastify";

export default function CreateVideoPage() {
    const [step, setStep] = useState<1 | 2>(1);
    const [title, setTitle] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbFile, setThumbFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const videoURL = useMemo(() => (videoFile ? URL.createObjectURL(videoFile) : ""), [videoFile]);
    const thumbURL = useMemo(() => (thumbFile ? URL.createObjectURL(thumbFile) : ""), [thumbFile]);

    useEffect(() => {
        return () => {
            if (videoURL) URL.revokeObjectURL(videoURL);
            if (thumbURL) URL.revokeObjectURL(thumbURL);
        };
    }, [videoURL, thumbURL]);

    const handleSubmit = async () => {
        if (!videoFile || !thumbFile) return toast.error("Thiếu dữ liệu");

        try {
            setSubmitting(true);

            // xin token
            let res = await fetch("/api/get-token");
            let data = await res.json();
            if (!data.success) return toast.error("Chưa đăng nhập");
            const token = data.access_token;

            // 👉 B1. Upload video lên Cloudinary unsigned
            const videoForm = new FormData();
            videoForm.append("file", videoFile);
            videoForm.append("upload_preset", process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!);

            res = await fetch(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/video/upload`, {
                method: "POST",
                body: videoForm,
            });

            const videoData = await res.json();
            if (!res.ok || !videoData.secure_url) {
                throw new Error(videoData.error?.message || "Upload video thất bại");
            }

            const videoUrl = videoData.secure_url;

            // 👉 B2. Gửi metadata cho backend để lưu DB
            const metaForm = new FormData();
            metaForm.append("title", title);
            metaForm.append("fileThumbnail", thumbFile);
            metaForm.append("url", videoUrl);

            res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/video/save`, {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: metaForm,
            });

            data = await res.json();
            if (!res.ok || !data?.success) {
                throw new Error(data?.message || "Lưu video thất bại");
            }

            toast.success("Đăng video thành công 🎉");
            setTitle("");
            setVideoFile(null);
            setThumbFile(null);
            setStep(1);
        } catch (err) {
            console.error(err);
            toast.error((err as Error).message);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Container maxWidth="sm" className={styles.page}>
            <Paper elevation={2} className={styles.card}>
                <Typography variant="h6" className={styles.heading}>
                    {step === 1 ? "Thông tin video" : "Tải video"}
                </Typography>

                {step === 1 && (
                    <>
                        <TextField
                            label="Tiêu đề"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            fullWidth
                            size="medium"
                            InputProps={{ className: styles.input }}
                        />

                        <Box className={styles.fileBox}>
                            <input
                                id="fileThumb"
                                type="file"
                                accept="image/*"
                                className={styles.hiddenInput}
                                onChange={(e) => setThumbFile(e.target.files?.[0] || null)}
                            />
                            <label htmlFor="fileThumb">
                                <Button variant="outlined" fullWidth component="span">
                                    {thumbFile ? `Đã chọn: ${thumbFile.name}` : "Chọn thumbnail"}
                                </Button>
                            </label>
                        </Box>

                        {thumbURL && (
                            <Box className={styles.previewImageWrap}>
                                <img className={styles.previewImage} src={thumbURL} alt="Thumbnail preview" />
                            </Box>
                        )}

                        <Stack direction="row" gap={1} className={styles.actions}>
                            <Button
                                variant="outlined"
                                fullWidth
                                className={styles.myButton}
                                onClick={() => {
                                    setTitle("");
                                    setThumbFile(null);
                                }}
                            >
                                Xóa
                            </Button>
                            <Button
                                variant="contained"
                                fullWidth
                                className={styles.myButton}
                                onClick={() => {
                                    if (!title || !thumbFile) {
                                        toast.error("Nhập tiêu đề và chọn thumbnail trước");
                                        return;
                                    }
                                    setStep(2);
                                }}
                            >
                                Tiếp tục
                            </Button>
                        </Stack>
                    </>
                )}

                {step === 2 && (
                    <>
                        <Box className={styles.fileBox}>
                            <input
                                id="fileVideo"
                                type="file"
                                accept="video/*"
                                className={styles.hiddenInput}
                                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                            />
                            <label htmlFor="fileVideo">
                                <Button variant="outlined" fullWidth component="span">
                                    {videoFile ? `Đã chọn: ${videoFile.name}` : "Chọn video"}
                                </Button>
                            </label>
                        </Box>

                        {videoURL && (
                            <Box className={styles.previewVideoWrap}>
                                <video className={styles.previewVideo} src={videoURL} controls playsInline />
                            </Box>
                        )}

                        <Stack direction="row" gap={1} className={styles.actions}>
                            <Button
                                variant="outlined"
                                fullWidth
                                className={styles.myButton}
                                onClick={() => setStep(1)}
                            >
                                Quay lại
                            </Button>
                            <Button
                                className={styles.myButton}
                                variant="contained"
                                fullWidth
                                disabled={submitting}
                                onClick={handleSubmit}
                            >
                                {submitting ? "Đang đăng..." : "Đăng video"}
                            </Button>
                        </Stack>
                    </>
                )}
            </Paper>
        </Container>
    );
}

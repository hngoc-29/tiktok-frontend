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
    const [step, setStep] = useState<1 | 2>(1); // bước hiện tại
    const [title, setTitle] = useState("");
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [thumbFile, setThumbFile] = useState<File | null>(null);
    const [submitting, setSubmitting] = useState(false);

    // preview URLs
    const videoURL = useMemo(() => (videoFile ? URL.createObjectURL(videoFile) : ""), [videoFile]);
    const thumbURL = useMemo(() => (thumbFile ? URL.createObjectURL(thumbFile) : ""), [thumbFile]);

    useEffect(() => {
        return () => {
            if (videoURL) URL.revokeObjectURL(videoURL);
            if (thumbURL) URL.revokeObjectURL(thumbURL);
        };
    }, [videoURL, thumbURL]);

    const handleSubmit = async () => {
        if (!videoFile || !thumbFile) {
            return toast.error(`Thiếu dữ liệu`);
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("fileVideo", videoFile);
        formData.append("fileThumbnail", thumbFile);

        try {
            setSubmitting(true);
            const res = await fetch("/api/video/create", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (!res.ok || !data?.success) {
                throw new Error(data?.message || "Upload thất bại");
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
                        {/* Title */}
                        <TextField
                            label="Tiêu đề"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            fullWidth
                            size="medium"
                            InputProps={{ className: styles.input }}
                        />

                        {/* Thumbnail picker */}
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

                        {/* Thumbnail preview */}
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
                        {/* Video picker */}
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

                        {/* Video preview */}
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

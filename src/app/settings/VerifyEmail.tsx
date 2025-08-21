"use client";

import { useEffect, useState, useTransition } from "react";
import styles from "./settings.module.css";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography
} from "@mui/material";

export default function VerifyEmail() {
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "warning" } | null>(null);
    const [isPending, startTransition] = useTransition();
    const [cooldown, setCooldown] = useState(0);
    const [open, setOpen] = useState(false); // mở/đóng modal

    // Khi load trang, đọc thời điểm lưu trong localStorage
    useEffect(() => {
        const lastTime = localStorage.getItem("verifyCooldown");
        if (lastTime) {
            const diff = Math.floor((Date.now() - parseInt(lastTime)) / 1000);
            if (diff < 60) {
                setCooldown(60 - diff);
            }
        }
    }, []);

    // Giảm dần cooldown mỗi giây
    useEffect(() => {
        if (cooldown > 0) {
            const interval = setInterval(() => {
                setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
            }, 1000);
            return () => clearInterval(interval);
        }
    }, [cooldown]);

    const handleConfirm = async () => {
        setOpen(false); // đóng modal
        setMessage(null);

        startTransition(async () => {
            const res = await fetch("/api/user/mail-verify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
            });
            const data = await res.json();

            if (data.success) {
                setMessage({ text: data.message, type: "success" });
            } else {
                return setMessage({ text: data.message || "❌ Lỗi khi gửi mail xác nhận", type: "error" });
            }

            // Sau khi gọi API thành công/thất bại, bắt đầu cooldown
            setCooldown(60);
            localStorage.setItem("verifyCooldown", Date.now().toString());
        });
    };

    return (
        <div className={styles.form}>
            <button
                type="button"
                onClick={() => setOpen(true)} // mở modal khi bấm
                className={styles.btn}
                disabled={isPending || cooldown > 0}
            >
                {isPending
                    ? "Đang xử lý..."
                    : cooldown > 0
                        ? `Vui lòng chờ ${cooldown}s`
                        : "Xác minh tài khoản"}
            </button>

            {message && (
                <div className={`${styles.message} ${styles[message.type]}`}>
                    {message.text}
                </div>
            )}

            {/* Modal xác nhận */}
            <Dialog open={open} onClose={() => setOpen(false)}>
                <DialogTitle>Xác nhận gửi email</DialogTitle>
                <DialogContent>
                    <Typography>
                        Hệ thống sẽ gửi mail xác nhận đến địa chỉ email của bạn. Bạn có chắc chắn muốn tiếp tục?
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)} color="error">Hủy</Button>
                    <Button onClick={handleConfirm} color="primary" autoFocus>
                        Xác nhận
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

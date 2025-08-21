"use client";

import { useState, useTransition } from "react";
import styles from "./settings.module.css";

export default function UpdatePasswordForm() {
    const [oldPass, setOldPass] = useState("");
    const [newPass, setNewPass] = useState("");
    const [confirm, setConfirm] = useState("");
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "warning" } | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        if (newPass !== confirm) {
            setMessage({ text: "⚠️ Mật khẩu xác nhận không khớp", type: "warning" });
            return;
        }

        startTransition(async () => {
            const res = await fetch("/api/user/update-password", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ password: oldPass, newPass }),
            });
            const data = await res.json();

            if (data.success) {
                setMessage({ text: "✅ Đổi mật khẩu thành công", type: "success" });
                setOldPass(""); setNewPass(""); setConfirm("");
            } else {
                setMessage({ text: data.message || "❌ Lỗi khi đổi mật khẩu", type: "error" });
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
                <label className={styles.label}>Mật khẩu cũ</label>
                <input
                    type="password"
                    className={styles.input}
                    value={oldPass}
                    onChange={(e) => setOldPass(e.target.value)}
                    disabled={isPending}
                    required
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Mật khẩu mới</label>
                <input
                    type="password"
                    className={styles.input}
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    disabled={isPending}
                    required
                />
            </div>
            <div className={styles.field}>
                <label className={styles.label}>Xác nhận mật khẩu</label>
                <input
                    type="password"
                    className={styles.input}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    disabled={isPending}
                    required
                />
            </div>
            <button type="submit" className={styles.btn} disabled={isPending}>
                {isPending ? "Đang đổi..." : "Cập nhật mật khẩu"}
            </button>
            {message && <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>}
        </form>
    );
}

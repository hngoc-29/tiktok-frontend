"use client";

import { useState, useTransition } from "react";
import styles from "./settings.module.css";

export default function UpdateNameForm({ initName }: { initName: string }) {
    const [name, setName] = useState(initName);
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" | "warning" } | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        startTransition(async () => {
            const res = await fetch("/api/user", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullname: name }),
            });
            const data = await res.json();

            if (data.success) {
                setMessage({ text: "✅ Đã cập nhật tên!", type: "success" });
            } else {
                setMessage({ text: data.message || "❌ Lỗi khi cập nhật tên!", type: "error" });
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.field}>
                <label className={styles.label}>Tên hiển thị</label>
                <input
                    type="text"
                    className={styles.input}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    disabled={isPending}
                />
            </div>
            <button type="submit" className={styles.btn} disabled={isPending}>
                {isPending ? "Đang lưu..." : "Cập nhật tên"}
            </button>
            {message && <div className={`${styles.message} ${styles[message.type]}`}>{message.text}</div>}
        </form>
    );
}

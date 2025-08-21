"use client";

import React, { useRef, useState } from "react";
import styles from "./styles/ChangeAvatar.module.css";
import AddIcon from "@mui/icons-material/Add";
import { toast } from "react-toastify";

export default function AvatarUpload({ avatarUrl }: { avatarUrl: string }) {
    const [preview, setPreview] = useState<string | null>(null);
    const [file, setFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);

    const handleClick = () => {
        fileInputRef.current?.click();
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const f = e.target.files[0];
            setPreview(URL.createObjectURL(f));
            setFile(f);
        }
    };

    const handleSave = async () => {
        if (!file) return;
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append("avatar", file);

            // Call API upload avatar
            const res = await fetch(`api/user/avatar`, {
                method: "POST",
                body: formData,
                credentials: "include", // nếu bạn dùng cookie auth
            });

            const data = await res.json();
            console.log("Upload success:", data);
            if (!data.success || data.error) {
                return toast.error(data.message)
            }
            setFile(null);
        } catch (err) {
            console.error("Upload error:", err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            {/* Avatar */}
            <img
                src={preview || avatarUrl}
                alt="avatar"
                className={styles.avatar}
                onClick={handleClick}
            />

            {/* Input hidden */}
            <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                className={styles.hiddenInput}
                onChange={handleChange}
            />

            {/* Icon dấu + */}
            <div className={styles.plusIcon} onClick={handleClick}>
                <AddIcon fontSize="small" />
            </div>

            {/* Nút Save khi có file mới */}
            {file && (
                <button
                    className={styles.saveBtn}
                    onClick={handleSave}
                    disabled={loading}
                >
                    {loading ? "Đang lưu..." : "Lưu"}
                </button>
            )}
        </div>
    );
}

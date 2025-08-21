"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Card, CardContent, Typography, Button } from "@mui/material";
import styles from "./verify.module.css";

export default function VerifyPage() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token") || "";

    const [success, setSuccess] = useState<boolean | null>(null);

    useEffect(() => {
        if (!token) {
            setSuccess(false);
            return;
        }

        const verify = async () => {
            try {
                // Gọi backend verify email
                const res = await fetch(`api/auth/verify-email`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });
                const data = await res.json();

                setSuccess(data.success);
            } catch (err) {
                console.error(err);
                setSuccess(false);
            }
        };

        verify();
    }, [token]);

    return (
        <div className={styles.container}>
            <Card className={styles.card}>
                <CardContent className={styles.center}>
                    {success === null ? (
                        <Typography variant="h5">🔄 Đang xác minh...</Typography>
                    ) : success ? (
                        <>
                            <Typography variant="h5" color="primary" gutterBottom>
                                ✅ Xác minh thành công!
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Email của bạn đã được xác nhận. Bây giờ bạn có thể đăng nhập.
                            </Typography>
                            <Button variant="contained" href="/login">
                                Đăng nhập ngay
                            </Button>
                        </>
                    ) : (
                        <>
                            <Typography variant="h5" color="error" gutterBottom>
                                ❌ Xác minh thất bại!
                            </Typography>
                            <Typography variant="body1" gutterBottom>
                                Token không hợp lệ hoặc đã hết hạn. Vui lòng thử lại.
                            </Typography>
                            <Button variant="outlined" href="/">
                                Quay về trang chủ
                            </Button>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

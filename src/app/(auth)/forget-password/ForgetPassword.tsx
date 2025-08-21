"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/contexts/UserContext";
import { useRouter } from "next/navigation";

import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Link,
    Paper
} from "@mui/material";
import { toast } from 'react-toastify';

export default function ForgetPasswordPage() {
    const [email, setEmail] = useState("");
    const { user, setUser } = useUser();
    const router = useRouter();

    const [cooldown, setCooldown] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Load cooldown từ localStorage
    useEffect(() => {
        const saved = localStorage.getItem("forgetCooldown");
        if (saved) {
            const expireTime = parseInt(saved);
            const diff = Math.floor((expireTime - Date.now()) / 1000);
            if (diff > 0) setCooldown(diff);
        }
    }, []);

    // Giảm cooldown mỗi giây
    useEffect(() => {
        if (cooldown <= 0) return;
        const interval = setInterval(() => {
            setCooldown(prev => {
                if (prev <= 1) {
                    localStorage.removeItem("forgetCooldown");
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(interval);
    }, [cooldown]);

    useEffect(() => {
        if (user && user.id) {
            router.push("/");
        }
    }, [user, router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (cooldown > 0) {
            toast.warning(`Vui lòng chờ ${cooldown}s trước khi thử lại`);
            return;
        }

        setIsSubmitting(true); // disable ngay khi submit

        try {
            const res = await fetch(`/api/auth/forget`, {
                method: 'POST',
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email })
            });
            const data = await res.json();

            if (!data.success) {
                toast.error(data.message);
            } else {
                setUser(data.user);
                toast.success(data.message)
                // Set cooldown 60s
                const expire = Date.now() + 60 * 1000;
                localStorage.setItem("forgetCooldown", expire.toString());
                setCooldown(60);
            }
        } catch (err) {
            toast.error("Có lỗi xảy ra, vui lòng thử lại");
        } finally {
            setIsSubmitting(false); // bật lại nút sau khi xử lý xong
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Quên mật khẩu
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        type="email"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        disabled={cooldown > 0 || isSubmitting}
                        sx={{ mt: 2, py: 1.2, borderRadius: 2 }}
                    >
                        {cooldown > 0
                            ? `Thử lại sau ${cooldown}s`
                            : isSubmitting
                                ? "Đang gửi..."
                                : "Gửi yêu cầu"}
                    </Button>
                </Box>

                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                    Đã có tài khoản?{" "}
                    <Link href="/login" underline="hover">
                        Đăng nhập
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
}

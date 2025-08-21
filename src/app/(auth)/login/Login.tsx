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
    Paper,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { user, setUser } = useUser();
    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch(`/api/auth/login`, {
            method: "POST",
            body: JSON.stringify({ email, password }),
        });
        const data = await res.json();
        if (!data.success) {
            return toast.error(data.message);
        }
        setUser(data.user);
        router.push("/profile")
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Đăng nhập
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

                    <TextField
                        label="Mật khẩu"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() => setShowPassword(!showPassword)}
                                        edge="end"
                                    >
                                        {showPassword ? <VisibilityOff /> : <Visibility />}
                                    </IconButton>
                                </InputAdornment>
                            ),
                        }}
                    />

                    <Button
                        type="submit"
                        variant="contained"
                        fullWidth
                        sx={{ mt: 2, py: 1.2, borderRadius: 2 }}
                    >
                        Đăng nhập
                    </Button>
                </Box>

                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                    Chưa có tài khoản?{" "}
                    <Link href="/register" underline="hover">
                        Đăng ký ngay
                    </Link>
                </Typography>
                <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                    <Link href="/forget-password" underline="hover">
                        Bạn quên mật khẩu?
                    </Link>
                </Typography>
            </Paper>
        </Container>
    );
}

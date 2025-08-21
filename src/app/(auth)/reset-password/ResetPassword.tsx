"use client";

import { useState } from "react";
import {
    Container,
    Box,
    TextField,
    Button,
    Typography,
    Paper,
    IconButton,
    InputAdornment,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ResetPassword({ token }: { token: string }) {
    const router = useRouter();

    const [formData, setFormData] = useState({
        password: "",
        confirmPassword: "",
    });

    const [errors, setErrors] = useState({
        password: "",
        confirmPassword: "",
    });

    // state toggle hiện/ẩn mật khẩu
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });

        setErrors({
            ...errors,
            [e.target.name]: "",
        });
    };

    const validate = () => {
        let valid = true;
        const newErrors = { password: "", confirmPassword: "" };

        if (!formData.password.trim()) {
            newErrors.password = "Mật khẩu là bắt buộc";
            valid = false;
        } else if (formData.password.length < 6) {
            newErrors.password = "Mật khẩu phải ít nhất 6 ký tự";
            valid = false;
        }

        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
            valid = false;
        }

        setErrors(newErrors);
        return valid;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (validate()) {
            try {
                const res = await fetch(`/api/auth/reset-password`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        token,
                        newPassword: formData.password,
                    }),
                });

                const data = await res.json();
                if (!data.success) {
                    return toast.error(data.message);
                }

                toast.success("Đặt lại mật khẩu thành công!");
                router.push("/login");
            } catch (err) {
                toast.error("Lỗi hệ thống, vui lòng thử lại");
            }
        }
    };

    return (
        <Container maxWidth="sm">
            <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
                <Typography variant="h4" align="center" gutterBottom>
                    Đặt lại mật khẩu
                </Typography>

                <Box component="form" onSubmit={handleSubmit}>
                    <TextField
                        label="Mật khẩu mới"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        fullWidth
                        margin="normal"
                        value={formData.password}
                        onChange={handleChange}
                        error={!!errors.password}
                        helperText={errors.password}
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

                    <TextField
                        label="Xác nhận mật khẩu"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        fullWidth
                        margin="normal"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    <IconButton
                                        onClick={() =>
                                            setShowConfirmPassword(!showConfirmPassword)
                                        }
                                        edge="end"
                                    >
                                        {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
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
                        Xác nhận
                    </Button>
                </Box>
            </Paper>
            <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Đã có tài khoản?{" "}
                <Link href="/login">
                    Đăng nhập
                </Link>
            </Typography>
        </Container>
    );
}

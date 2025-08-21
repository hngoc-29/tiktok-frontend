"use client";

import { useState } from "react";
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
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    fullname: "",
    username: "",
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

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
    const newErrors: typeof errors = {
      fullname: "",
      username: "",
      email: "",
      password: "",
    };

    if (!formData.fullname.trim()) {
      newErrors.fullname = "Họ và tên là bắt buộc";
      valid = false;
    }
    if (!formData.username.trim()) {
      newErrors.username = "Tên đăng nhập là bắt buộc";
      valid = false;
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email là bắt buộc";
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
      valid = false;
    }
    if (!formData.password.trim()) {
      newErrors.password = "Mật khẩu là bắt buộc";
      valid = false;
    } else if (formData.password.length < 6) {
      newErrors.password = "Mật khẩu phải ít nhất 6 ký tự";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      const res = await fetch(`/api/auth/register`, {
        method: "POST",
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!data.success) {
        return toast.error(data.message);
      }
      toast.success("Đăng ký thành công!");
      router.push("/login");
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 4, mt: 8, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Đăng ký
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            label="Họ và tên"
            name="fullname"
            fullWidth
            margin="normal"
            value={formData.fullname}
            onChange={handleChange}
            error={!!errors.fullname}
            helperText={errors.fullname}
          />

          <TextField
            label="Tên đăng nhập"
            name="username"
            fullWidth
            margin="normal"
            value={formData.username}
            onChange={handleChange}
            error={!!errors.username}
            helperText={errors.username}
          />

          <TextField
            label="Email"
            name="email"
            type="email"
            fullWidth
            margin="normal"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email}
          />

          <TextField
            label="Mật khẩu"
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

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, py: 1.2, borderRadius: 2 }}
          >
            Đăng ký
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

"use client";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import ReactMarkdown from "react-markdown";
import { Notification } from "@/type/types";

export default function ActiveNotification() {
  const [notification, setNotification] = useState<Notification>({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchNotification = async () => {
      try {
        const res = await fetch("/api/notification/active");
        const data = await res.json();

        if (data.success && data.data) {
          const dismissed = JSON.parse(
            localStorage.getItem("dismissedNotifications") || "[]"
          );

          // chỉ mở modal nếu chưa đóng
          if (!dismissed.includes(data.data.id)) {
            setNotification(data.data);
            setOpen(true);
          }
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotification();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };

  const handleDismiss = () => {
    const dismissed = JSON.parse(
      localStorage.getItem("dismissedNotifications") || "[]"
    );
    if (!dismissed.includes(notification.id)) {
      dismissed.push(notification.id);
      localStorage.setItem("dismissedNotifications", JSON.stringify(dismissed));
    }
    setOpen(false);
  };

  if (!notification) return null;

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>{notification.title}</DialogTitle>
      <DialogContent>
        <div className="prose">
          <ReactMarkdown>{notification.content}</ReactMarkdown>
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleDismiss}>
          Ẩn
        </Button>
        <Button variant="contained" onClick={handleClose}>Đóng</Button>
      </DialogActions>
    </Dialog>
  );
}

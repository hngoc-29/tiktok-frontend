"use client";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
} from "@mui/material";
import ReactMarkdownPreview from "@uiw/react-markdown-preview";
import { toast } from "react-toastify";
import styles from "./styles/NotifyManager.module.css";
import { Notification } from "@/type/types";

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false });

export default function NotifyManager() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openView, setOpenView] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState<string | undefined>("");

  const [viewContent, setViewContent] = useState<string>("");

  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editContent, setEditContent] = useState<string | undefined>("");

  const handleFetch = async () => {
    const res = await fetch("/api/notification/list");
    const data = await res.json();
    setNotifications(data.data || []);
  };

  useEffect(() => {
    handleFetch();
  }, []);

  const handleSave = async () => {
    const res = await fetch("/api/notification/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content }),
    });
    const data = await res.json();
    if (!data.success) return toast.error(data.message);
    toast.success("Tạo thông báo thành công");
    setOpenCreate(false);
    setTitle("");
    setContent("");
    handleFetch();
  };

  const handleView = (c: string) => {
    setViewContent(c);
    setOpenView(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Bạn có chắc muốn xóa?")) return;
    const res = await fetch(`/api/notification/delete?id=${id}`, {
      method: "DELETE",
    });
    const data = await res.json();
    if (!data.success) return toast.error(data.message);
    toast.success("Xóa thành công");
    handleFetch();
  };

  const handleUpdateActive = async (id: number, active: boolean) => {
    const res = await fetch(`/api/notification/update-active?id=${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active }),
    });
    const data = await res.json();
    if (!data.success) return toast.error(data.message);
    toast.success("Cập nhật trạng thái");
    handleFetch();
  };

  const handleEditOpen = (n: Notification) => {
    setEditId(n.id || 0);
    setEditTitle(n.title || '');
    setEditContent(n.content);
    setOpenEdit(true);
  };

  const handleEditSave = async () => {
    if (!editId) return;
    const res = await fetch(`/api/notification/update?id=${editId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: editTitle, content: editContent }),
    });
    const data = await res.json();
    if (!data.success) return toast.error(data.message);
    toast.success("Sửa thông báo thành công");
    setOpenEdit(false);
    setEditId(null);
    handleFetch();
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Quản lý Thông báo</h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpenCreate(true)}
        >
          Tạo thông báo
        </Button>
      </div>

      <div className={styles.tableWrapper}>
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Tiêu đề</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {notifications.map((n) => (
                <TableRow key={n.id}>
                  <TableCell>{n.title}</TableCell>
                  <TableCell>
                    {n.active ? (
                      <Chip label="Active" color="success" size="small" />
                    ) : (
                      <Chip label="Inactive" color="default" size="small" />
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <div className={styles.actions}>
                      <Button size="small" onClick={() => handleView(n.content || '')}>
                        Xem
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleDelete(n.id || 0)}
                      >
                        Xóa
                      </Button>
                      <Button size="small" onClick={() => handleEditOpen(n)}>
                        Sửa
                      </Button>
                      <Button
                        size="small"
                        onClick={() => handleUpdateActive(n.id || 0, !n.active)}
                      >
                        {n.active ? "Tắt" : "Bật"}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {notifications.length === 0 && (
                <TableRow>
                  <TableCell colSpan={3} align="center">
                    Chưa có thông báo nào
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

      {/* Modal tạo */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} fullWidth maxWidth="md">
        <DialogTitle>Tạo thông báo</DialogTitle>
        <DialogContent>
          <TextField
            label="Tiêu đề"
            fullWidth
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <MDEditor value={content} onChange={setContent} height={300} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Hủy</Button>
          <Button onClick={handleSave} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>

      {/* Modal xem */}
      <Dialog open={openView} onClose={() => setOpenView(false)} fullWidth maxWidth="md">
        <DialogTitle>Xem thông báo</DialogTitle>
        <DialogContent>
          <ReactMarkdownPreview
            source={viewContent}
            style={{
              backgroundColor: "transparent", // dùng nền trong suốt
              color: "inherit",               // giữ màu chữ theo theme
              padding: 0                      // bỏ padding dư
            }}
          />
        </DialogContent>
      </Dialog>


      {/* Modal sửa */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="md">
        <DialogTitle>Sửa thông báo</DialogTitle>
        <DialogContent>
          <TextField
            label="Tiêu đề"
            fullWidth
            value={editTitle}
            onChange={(e) => setEditTitle(e.target.value)}
            sx={{ mb: 2 }}
          />
          <MDEditor value={editContent} onChange={setEditContent} height={300} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Hủy</Button>
          <Button onClick={handleEditSave} variant="contained">Lưu</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

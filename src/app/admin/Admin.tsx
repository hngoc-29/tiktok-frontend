"use client";
import React, { useState } from "react";
import AdminLayout from "./components/AdminLayout";
import NotifyManager from "./components/NotifyManager";
import { Metadata } from "next";

export default function Admin() {
  const [selected, setSelected] = useState("notify");

  return (
    <AdminLayout>
      {selected === "notify" && <NotifyManager />}
      {selected === "user" && <div>Quản lý User</div>}
      {selected === "video" && <div>Quản lý Video</div>}
    </AdminLayout>
  );
}

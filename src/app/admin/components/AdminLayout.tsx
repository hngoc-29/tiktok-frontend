"use client";
import React, { useState } from "react";
import Sidebar from "./Sidebar";
import styles from "./styles/layout.module.css";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [selected, setSelected] = useState("notify");

  return (
    <div className={styles.container}>
      <Sidebar selected={selected} setSelected={setSelected} />
      <div className={styles.content}>{children}</div>
    </div>
  );
}

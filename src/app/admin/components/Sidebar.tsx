"use client";
import React, { useState } from "react";
import styles from "./styles/sidebar.module.css";

const menus = [
  { key: "notify", label: "Thông báo" },
  { key: "user", label: "Người dùng" },
  { key: "video", label: "Video" },
];

export default function Sidebar({
  selected,
  setSelected,
}: {
  selected: string;
  setSelected: (v: string) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${styles.sidebar} ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.header}>
        <h2 className={styles.title}>{isOpen ? "Admin" : "A"}</h2>
        <button className={styles.toggle} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? "«" : "»"}
        </button>
      </div>

      <ul className={styles.menu}>
        {menus.map((m) => (
          <li
            key={m.key}
            className={`${styles.item} ${selected === m.key ? styles.active : ""}`}
            onClick={() => setSelected(m.key)}
          >
            {isOpen ? m.label : m.label.charAt(0)}
          </li>
        ))}
      </ul>
    </div>
  );
}

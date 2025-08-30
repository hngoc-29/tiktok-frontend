"use client";

import Link from "next/link";
import React from "react";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
        color: "#fff",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "480px", width: "100%", textAlign: "center" }}>
        <div
          style={{
            margin: "0 auto",
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: "linear-gradient(to bottom right, #ec4899, #6366f1, #facc15)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 10px 25px rgba(0,0,0,0.5)",
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            style={{ width: "48px", height: "48px", color: "white" }}
          >
            <path
              fill="currentColor"
              d="M12 3C8.13 3 5 6.13 5 10c0 3.87 3.13 7 7 7s7-3.13 7-7c0-3.87-3.13-7-7-7zm0 12.5c-3.02 0-5.5-2.48-5.5-5.5S8.98 4.5 12 4.5 17.5 6.98 17.5 10 15.02 15.5 12 15.5z"
            />
          </svg>
        </div>

        <h1 style={{ marginTop: "32px", fontSize: "28px", fontWeight: "bold" }}>
          Không tìm thấy trang
        </h1>
        <p style={{ marginTop: "12px", fontSize: "14px", color: "#d1d5db" }}>
          Trang bạn đang tìm không tồn tại hoặc đã bị di chuyển. Nhưng yên tâm —
          vẫn có rất nhiều video hay chờ bạn xem!
        </p>

        <div
          style={{
            marginTop: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "12px",
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 20px",
              borderRadius: "9999px",
              backgroundColor: "#fff",
              color: "#000",
              fontWeight: 600,
              boxShadow: "0 4px 10px rgba(0,0,0,0.25)",
              textDecoration: "none",
            }}
          >
            Về trang chủ
          </Link>

          <button
            type="button"
            onClick={() => {
              if (typeof window !== "undefined") window.history.back();
            }}
            style={{
              padding: "8px 16px",
              borderRadius: "9999px",
              border: "1px solid #374151",
              fontSize: "14px",
              color: "#e5e7eb",
              background: "transparent",
              cursor: "pointer",
            }}
          >
            Quay lại
          </button>
        </div>

        <div style={{ marginTop: "32px", fontSize: "12px", color: "#6b7280" }}>
          <span>
            Gợi ý: kiểm tra lại link hoặc thử truy cập trang chủ TopTop để tiếp tục.
          </span>
        </div>
      </div>
    </main>
  );
}
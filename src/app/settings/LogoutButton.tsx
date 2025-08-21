"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
    const router = useRouter();

    const handleLogout = async () => {
        try {
            await fetch("/api/auth/logout", { method: "POST" });
            // API này sẽ clear cookie ở server

            router.push("/profile");
            router.refresh(); // refresh lại state
        } catch (error) {
            console.error("Logout failed", error);
        }
    };

    return (
        <button
            onClick={handleLogout}
            style={{
                background: "#ef4444",
                color: "white",
                padding: "10px 18px",
                borderRadius: "8px",
                fontWeight: 600,
                marginTop: "12px",
                cursor: "pointer",
            }}
        >
            🚪 Đăng xuất
        </button>
    );
}

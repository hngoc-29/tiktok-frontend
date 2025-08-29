"use client";
import React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import HomeIcon from "@mui/icons-material/Home";
import AddBoxOutlinedIcon from "@mui/icons-material/AddBoxOutlined";
import AddBoxIcon from "@mui/icons-material/AddBox";
import PersonIcon from "@mui/icons-material/Person";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import styles from "./styles/Bottom.module.css";

export default function Bottom() {
    const pathname = usePathname();

    return (
        <div className={styles.wrapper} style={{
            backgroundColor: pathname === '/' || pathname.includes('video') ? 'black' : 'white'
        }}>
            {/* Home */}
            <Link href="/">
                <div className={styles.nav} style={{ color: (pathname === "/" || pathname.includes(`video`)) ? "white" : "black" }}>
                    {pathname === "/" ? (
                        <HomeIcon sx={{ fontSize: 28 }} />
                    ) : (
                        <HomeOutlinedIcon sx={{ fontSize: 28 }} />
                    )}
                    <span>
                        Trang chủ
                    </span>
                </div>
            </Link>

            {/* Create */}
            <Link href="/create">
                <div className={`${styles.nav}`} style={{ color: pathname === '/' || pathname.includes('video') ? "white" : "black" }}>
                    {pathname === "/create" ? (
                        <AddBoxIcon sx={{ fontSize: 38 }} />
                    ) : (
                        <AddBoxOutlinedIcon sx={{ fontSize: 38 }} />
                    )}
                </div>
            </Link>

            {/* Profile */}
            <Link href="/profile">
                <div className={styles.nav} style={{ color: pathname === '/' || pathname.includes('video') ? "white" : "black" }}>
                    {pathname === "/profile" ? (
                        <PersonIcon sx={{ fontSize: 28 }} />
                    ) : (
                        <PersonOutlineOutlinedIcon sx={{ fontSize: 28 }} />
                    )}
                    <span>
                        Hồ sơ
                    </span>
                </div>
            </Link>
        </div>
    );
}

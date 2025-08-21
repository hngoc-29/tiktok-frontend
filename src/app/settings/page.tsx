import styles from "./settings.module.css";
import { getCookie } from "@/helps/cookie";
import UpdateNameForm from "./UpdateNameForm";
import UpdatePasswordForm from "./UpdatePasswordForm";
import VerifyEmail from "./VerifyEmail";
import { Metadata } from "next";
import LogoutButton from "./LogoutButton";

export const metadata: Metadata = {
    title: "TopTop | Cài đặt",
    description: "Trang cài đặt tài khoản của toptop",
};

export default async function Page() {
    const token = await getCookie("access_token");
    const res = await fetch(`${process.env.BASE_URL}/api/user`, {
        method: "GET",
        headers: { "x-access-token": token ?? "" },
        cache: "no-store",
    });

    const data = await res.json();
    let user = null;
    if (data.success) user = data.user;

    if (!user) {
        return (
            <div className={styles.container}>
                <h1 className={styles.heading}>⚙️ Cài đặt tài khoản</h1>
                <p className={styles.notice}>🔒 Vui lòng đăng nhập trước để tiếp tục</p>
                <a href="/login" className={styles.loginBtn}>Đăng nhập</a>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <h1 className={styles.heading}>⚙️ Cài đặt tài khoản</h1>

            {/* Thông tin tài khoản */}
            <div className={styles.card}>
                <h2>👤 Thông tin tài khoản</h2>
                <div className={styles.field}>
                    <span className={styles.label}>Email:</span>
                    <span className={styles.value}>{user.email}</span>
                </div>
                <div className={styles.field}>
                    <span className={styles.label}>Tên đăng nhập:</span>
                    <span className={styles.value}>{user.username}</span>
                </div>

                {/* Form đổi tên */}
                <UpdateNameForm initName={user.fullname} />
                <LogoutButton />
            </div>

            <div className={styles.card}>
                <VerifyEmail />
            </div>

            {/* Đổi mật khẩu */}
            <div className={styles.card}>
                <h2>🔑 Đổi mật khẩu</h2>
                <UpdatePasswordForm />
            </div>
        </div>
    );
}

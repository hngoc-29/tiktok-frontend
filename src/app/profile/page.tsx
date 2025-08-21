import PermIdentityOutlinedIcon from '@mui/icons-material/PermIdentityOutlined';
import styles from './profile.module.css';
import NoUser from './NoUser';
import { getCookie } from '@/helps/cookie';
import Profile from '@/components/Profile';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: "TopTop | Thông tin người dùng",
    description: "Trang thông tin người dùng của toptop",
};

export default async function ProfilePage() {
    const token = await getCookie("access_token");
    const res = await fetch(`${process.env.BASE_URL}/api/user`, {
        method: "GET",
        headers: {
            "x-access-token": token ?? "", // dùng custom header, tránh xung đột
        },
    });
    const data = await res.json();
    let user = null;
    if (data.success) {
        user = data.user;
    }

    return (
        <div className={styles.profileContainer}>
            {!user ? (
                <>
                    <h1 className={styles.profileHeader}>Profile</h1>
                    <NoUser />
                </>
            ) : (
                <Profile user={user} isMe={true} />
            )}
        </div>
    );
}
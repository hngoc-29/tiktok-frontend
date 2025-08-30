import { UserType } from '@/type/User'
import React from 'react'
import SettingsIcon from '@mui/icons-material/Settings';

import styles from './styles/Profile.module.css'
import UserInfo from './ui/UserInfo'
import Link from 'next/link';
import ProfileVideo from './ui/ProfileVideo';

export default function Profile({ user, isMe = false }: { user: UserType, isMe: boolean }) {
    return (
        <div  className={styles.wrapper}>
            <div className={styles.header}>
                <h1 className={styles.profileHeader}>{user.fullname}</h1>
                {isMe && <Link href='/settings' className={styles.settingIcon}>
                    <SettingsIcon />
                </Link>}
            </div>
            <div>
                <UserInfo user={user} isMe={isMe} />
            </div>
            <div>
                <ProfileVideo user={user} isMe={isMe} />
            </div>
        </div>
    )
}

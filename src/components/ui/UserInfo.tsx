import { UserType } from '@/type/User'
import React from 'react'
import styles from './styles/UserInfo.module.css'
import ChangeAvatar from './ChangeAvatar';
import Link from "next/link";
import FollowButton from './FollowButton';
import { getCookie } from '@/helps/cookie';

export default async function UserInfo({ user, isMe = false }: { user: UserType, isMe: boolean }) {
    const resFollowers = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/follow/countFollowers?userId=${user.id}`,
        { cache: 'no-store' } // không cache
    );
    const dataFollowers = await resFollowers.json();
    const followers = dataFollowers.success ? dataFollowers.data : null;

    const resFollowing = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/follow/countFollowing?userId=${user.id}`,
        { cache: 'no-store' }
    );
    const dataFollowing = await resFollowing.json();
    const following = dataFollowing.success ? dataFollowing.data : null;

    const token = await getCookie(`access_token`);
    const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/follow/user?followingId=${user.id}`, {
        headers: { 'Authorization': `Bearer ${token}` },
        cache: 'no-store'
    });
    const data = await res.json();
    const isFollowing = data.success && data.data;

    return (
        <div className={styles.wrapper}>
            <div>
                {!isMe ? (
                    <img className={styles.avatar} width={100} height={100} src={user.avatarUrl} />
                ) : (
                    <ChangeAvatar avatarUrl={user.avatarUrl} />
                )}
            </div>
            <div>
                <span>@{user.username}</span>
            </div>
            <div className={styles.followInfo}>
                {!isMe ? (
                    <>
                        <FollowButton userId={user.id} initialIsFollowing={isFollowing} initialFollowers={followers} />
                        <div className={styles.count}>
                            <span className={styles.number}>{followers}</span>
                            <span>Follower</span>
                        </div>
                        <div className={styles.count}>
                            <span className={styles.number}>{following}</span>
                            <span>Đã follow</span>
                        </div>
                    </>
                ) : (
                    <>
                        <Link href={`/user/followers?tab=following`} className={styles.count}>
                            <span className={styles.number}>{following}</span>
                            <span>Đã follow</span>
                        </Link>
                        <Link href={`/user/followers?tab=followers`} className={styles.count}>
                            <span className={styles.number}>{followers}</span>
                            <span>Follower</span>
                        </Link>
                    </>
                )}
            </div>
        </div>
    )
}

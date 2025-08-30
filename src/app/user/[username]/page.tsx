// app/[username]/page.tsx
import Profile from '@/components/Profile'
import { getCookie } from '@/helps/cookie';
import React from 'react'
import User from './User';
import { generateUserMetadata } from './metadata';

interface PageProps {
    params: Promise<{ username: string }>;
}

// Gắn metadata động từ file metadata.ts
export async function generateMetadata({ params }: PageProps) {
    const { username } = await params;
    return generateUserMetadata(username);
}

export default async function Page({ params }: PageProps) {
    const { username } = await params;
    const token = await getCookie("access_token");
    let res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/user?username=${username}`);

    let data = await res.json();

    let user = null;
    if (data) {
        user = data;
    } else {
        return <></>;
    }

    res = await fetch(`${process.env.BASE_URL}/api/user`, {
        method: "GET",
        headers: {
            "x-access-token": token ?? "", // dùng custom header, tránh xung đột
        },
    });

    data = await res.json();
    const my = data.success ? data.user : {};

    return (
        <div>
            <Profile user={user} isMe={my.id === user.id} />
        </div>
    )
}

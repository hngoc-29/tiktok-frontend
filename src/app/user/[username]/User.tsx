'use client'
import { useUser } from '@/contexts/UserContext'
import Profile from '@/components/Profile';
import React from 'react'
import { UserType } from '@/type/User';

export default function User({ userRender }: { userRender: UserType }) {
    const { user } = useUser(); // user hiện tại từ context

    if (!userRender || !user) return null;

    return (
        <div>
            <Profile user={userRender} isMe={userRender.id === user.id} />
        </div>
    )
}

'use client'

import { useEffect } from "react"

export default function RefreshToken() {
    useEffect(() => {
        (async () => {
            await fetch('/api/auth/refresh-token', {
                method: 'POST',
                headers: {
                    "Content-Type": "application/json",
                },
            })
        })()
    }, [])
    return (
        <></>
    )
}

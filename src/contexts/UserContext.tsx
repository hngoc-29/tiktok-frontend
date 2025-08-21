"use client";

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    Dispatch,
    SetStateAction,
} from "react";
import { UserType } from "@/type/User";

// User mặc định
const defaultUser: UserType = {
    id: null,
    fullname: "",
    username: "",
    email: "",
    active: false,
    isAdmin: false,
    avatarUrl: "",
    createdAt: null,
};

interface UserContextType {
    user: UserType;
    setUser: Dispatch<SetStateAction<UserType>>;
    loading: boolean;
}

// Context với type rõ ràng
const UserContext = createContext<UserContextType>({
    user: defaultUser,
    setUser: () => { },
    loading: true,
});

// Provider
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<UserType>(defaultUser);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await fetch("/api/user", {
                    credentials: "include", // nếu cần gửi cookie/session
                });
                if (res.ok) {
                    const data = await res.json();
                    setUser(data.user);
                }
            } catch (err) {
                console.error("Lỗi fetch user:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
            {children}
        </UserContext.Provider>
    );
};

// Hook tiện dụng
export const useUser = () => useContext(UserContext);

export interface UserType {
    id: number | null;
    fullname: string;
    username: string;
    email: string;
    active: boolean | null;
    isAdmin: boolean;
    avatarUrl: string;
    createdAt: string | null;
}

export type User = {
    id: number;
    fullname: string;
    username: string;
    avatarUrl?: string | null;
};

export type Video = {
    id: number;
    title: string;
    url: string;
    thumbnailUrl?: string | null;
    userId: number;
    createdAt: string;
    // tiện cho frontend (tính sẵn)
    likeCount: number;
    commentCount: number;
    path: string
};

export type Comment = {
    id: number;
    content: string;
    userId: number;
    videoId: number;
    createdAt: string;
};

export type Like = {
    id: number;
    userId: number;
    videoId: number;
};

export type Notification = {
    id?: number;
    title?: string;
    content?: string;
    active?: boolean;
}
import type { Metadata } from "next";
import { Video } from "@/type/types";

export async function generateVideoMetadata(path: string): Promise<Metadata> {
    try {
        const res = await fetch(`${process.env.BACKEND_URL}/video?path=${path}`, {
            cache: "no-store",
        });
        const data = await res.json();

        if (!data.success) {
            return {
                title: "Video không tồn tại | TopTop",
                description: "Video bạn tìm kiếm không tồn tại hoặc đã bị xóa.",
            };
        }

        const video: Video = data.video;

        // Lấy thông tin tác giả
        const authorRes = await fetch(
            `${process.env.BACKEND_URL}/user/info?userId=${video.userId}`,
            { cache: "no-store" }
        );
        const authorData = await authorRes.json();
        const author = authorData.user;

        const displayTitle = video.title || "Video trên TopTop";

        return {
            title: `${displayTitle} | TopTop`,
            description: `${displayTitle} - đăng bởi @${author.username} trên TopTop. Xem ngay video ngắn hấp dẫn.`,
            openGraph: {
                title: `${displayTitle} | TopTop`,
                description: `${displayTitle} - đăng bởi @${author.username}`,
                url: `${process.env.BASE_URL}/video/${video.path}`,
                siteName: "TopTop",
                images: [
                    {
                        url: video.thumbnailUrl || "/og-video.png",
                        width: 1200,
                        height: 630,
                        alt: displayTitle,
                    },
                ],
                locale: "vi_VN",
                type: "video.other",
            },
            twitter: {
                card: "summary_large_image",
                title: `${displayTitle} | TopTop`,
                description: `${displayTitle} - đăng bởi @${author.username}`,
                images: [video.thumbnailUrl || "/og-video.png"],
            },
        };
    } catch (error) {
        return {
            title: "Lỗi tải dữ liệu | TopTop",
            description: "Không thể tải thông tin video",
        };
    }
}

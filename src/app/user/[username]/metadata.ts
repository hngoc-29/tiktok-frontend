import type { Metadata } from "next";

interface UserInfo {
    id: number;
    username: string;
    fullname?: string;
    avatar?: string;
}

export async function generateUserMetadata(username: string): Promise<Metadata> {
    try {
        const res = await fetch(
            `${process.env.BASE_URL}/api/user/info?username=${username}`,
            { method: "POST", cache: "no-store" }
        );

        const data: UserInfo = await res.json();

        if (!data || !data.username) {
            return {
                title: "Người dùng không tồn tại | TopTop",
                description: "Trang cá nhân không tìm thấy trên TopTop",
            };
        }

        const displayName = data.fullname || data.username;

        return {
            title: `${displayName} (@${data.username}) | TopTop`,
            description: `Xem video và hồ sơ của @${data.username} trên TopTop`,
            openGraph: {
                title: `${displayName} (@${data.username}) | TopTop`,
                description: `Khám phá trang cá nhân của @${data.username}`,
                url: `https://toptop.vn/${data.username}`,
                siteName: "TopTop",
                images: [
                    {
                        url: data.avatar || "/og-image.png",
                        width: 400,
                        height: 400,
                        alt: `${displayName} - TopTop`,
                    },
                ],
                locale: "vi_VN",
                type: "profile",
            },
            twitter: {
                card: "summary_large_image",
                title: `${displayName} (@${data.username}) | TopTop`,
                description: `Khám phá trang cá nhân của @${data.username}`,
                images: [data.avatar || "/og-image.png"],
            },
        };
    } catch (err) {
        return {
            title: "Lỗi tải dữ liệu | TopTop",
            description: "Không thể tải thông tin người dùng",
        };
    }
}

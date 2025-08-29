import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import CheckDevice from "@/components/CheckDevice";
import Bottom from "@/components/Bottom";
import Notification from "@/components/Notification";
import { UserProvider } from "@/contexts/UserContext";
import { VideoProvider } from "@/contexts/VideoContext";
import RefreshToken from "@/components/RefreshToken";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TopTop - TikTok Clone Việt Nam",
  description:
    "TopTop là nền tảng video ngắn giải trí hàng đầu, nơi bạn có thể xem, chia sẻ và sáng tạo nội dung mọi lúc mọi nơi.",
  keywords: [
    "TopTop",
    "TikTok Clone",
    "Video ngắn",
    "Mạng xã hội",
    "Giải trí",
    "Chia sẻ video",
  ],
  authors: [{ name: "TopTop Team", url: "https://toptopclone.vercel.app" }],
  openGraph: {
    title: "TopTop - TikTok Clone Việt Nam",
    description:
      "Xem, chia sẻ và sáng tạo video ngắn với TopTop - nền tảng video giải trí hàng đầu.",
    url: process.env.BASE_URL,
    siteName: "TopTop",
    images: [
      {
        url: "/thumbnail.png", // thay bằng ảnh preview của bạn
        width: 1200,
        height: 630,
        alt: "TopTop - TikTok Clone Việt Nam",
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "TopTop - TikTok Clone Việt Nam",
    description:
      "Khám phá kho video ngắn và sáng tạo nội dung cùng cộng đồng TopTop.",
    images: ["/thumbnail.png"], // ảnh preview khi share Twitter
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi">
      <head>
        <meta name="google-site-verification" content="exKzkXXkfCbBRohkUy2ptqVdT9oa8jqNnGSp2cY2m-Y" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <UserProvider>
          <VideoProvider>
            <CheckDevice>
              <RefreshToken />
              <Notification />
              {children}
              <Bottom />
            </CheckDevice>
          </VideoProvider>
        </UserProvider>
      </body>
    </html>
  );
}


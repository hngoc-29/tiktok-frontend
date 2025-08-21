import { headers } from "next/headers";
import { ToastContainer } from 'react-toastify';

export default async function CheckDevice({ children }: { children: React.ReactNode }) {
  const ua = (await headers()).get("user-agent") || "";
  const isMobile = /Mobi|Android/i.test(ua);

  return (
    <>
      {isMobile ? <main>{children}</main> : <div>Chỉ hiển thị trên thiết bị di động</div>}
      <ToastContainer />
    </>
  );
}

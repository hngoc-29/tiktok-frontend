import Admin from "./Admin";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "TopTop | Quản lý",
  description: "Trang quản lý của toptop",
};

export default function AdminPage() {
  return (
    <Admin />
  );
}

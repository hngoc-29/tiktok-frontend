import { Metadata } from 'next';
import Login from './Login'
export const metadata: Metadata = {
  title: "TopTop | Đăng nhập",
  description: "Trang đăng nhập tài khoản của toptop",
};
export default function page() {
  return (
    <>
      <Login />
    </>
  )
}

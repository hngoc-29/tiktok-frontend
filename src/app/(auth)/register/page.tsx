import { Metadata } from 'next';
import Register from './Register'

export const metadata: Metadata = {
  title: "TopTop | Đăng kí",
  description: "Trang đăng kí tài khoản của toptop",
};

export default function page() {
  return (
    <>
      <Register />
    </>
  )
}

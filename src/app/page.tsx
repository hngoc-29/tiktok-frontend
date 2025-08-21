import Image from "next/image";
import styles from "./page.module.css";
import TikTokFeed from "@/components/TikTokFeed";

export default function Home() {
  return (
    <div className={styles.container}>
      <TikTokFeed />
    </div>
  );
}

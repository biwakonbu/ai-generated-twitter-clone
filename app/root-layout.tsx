import RootLayout from "./layout";
import { metadata } from "./metadata";
import { initializeDatabase } from "./lib/db-init";

// サーバーサイドでのみ実行されるデータベースの初期化
try {
  initializeDatabase();
} catch (error) {
  console.error("データベース初期化エラー:", error);
}

export { metadata };

export default function ServerRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RootLayout>{children}</RootLayout>;
}

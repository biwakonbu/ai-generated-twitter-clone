import { initDatabase } from "../db/database";

// アプリケーション起動時にデータベースを初期化する
export function initializeDatabase() {
  try {
    console.log("データベースを初期化しています...");
    initDatabase();
    console.log("データベースの初期化が完了しました。");
  } catch (error) {
    console.error("データベースの初期化中にエラーが発生しました:", error);
    throw error;
  }
}

import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// データベースファイルのパスを設定
const dbPath = path.resolve(process.cwd(), "app/db/twitter.db");

// データベース接続の初期化
const initializeDb = () => {
  // データベースファイルが存在するか確認し、存在しない場合はディレクトリを作成
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  // データベース接続を開く
  const db = new Database(dbPath);

  // WALモードを有効にして同時アクセスとパフォーマンスを向上
  db.pragma("journal_mode = WAL");

  // 外部キー制約を有効化
  db.pragma("foreign_keys = ON");

  return db;
};

// シングルトンとしてデータベース接続を管理
let db: Database.Database;

export const getDb = () => {
  if (!db) {
    db = initializeDb();
  }
  return db;
};

// データベースの初期化（テーブル作成など）
export const initDatabase = () => {
  const db = getDb();

  // ユーザーテーブル作成
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    )
  `);

  // ツイートテーブル作成
  db.exec(`
    CREATE TABLE IF NOT EXISTS tweets (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  // いいねテーブル作成
  db.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      id TEXT PRIMARY KEY,
      tweet_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      FOREIGN KEY (tweet_id) REFERENCES tweets(id),
      FOREIGN KEY (user_id) REFERENCES users(id),
      UNIQUE(tweet_id, user_id)
    )
  `);

  // リプライ（コメント）テーブル作成
  db.exec(`
    CREATE TABLE IF NOT EXISTS replies (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      tweet_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (tweet_id) REFERENCES tweets(id),
      FOREIGN KEY (user_id) REFERENCES users(id)
    )
  `);

  console.log("Database initialized with all tables.");
};

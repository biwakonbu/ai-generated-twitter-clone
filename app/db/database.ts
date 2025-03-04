// @ts-nocheck
/* server-only */

const Database = require("better-sqlite3");
const path = require("path");
const fs = require("fs");

// データベースへの接続を保持するための変数
let db = null;

/**
 * データベースを初期化する
 * @returns {Database.Database} SQLiteデータベース接続
 */
const initializeDb = () => {
  try {
    // データベースディレクトリの確認と作成
    const dbDir = path.resolve(process.cwd(), "sqlite");
    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
    }

    // データベースファイルのパス
    const dbPath = path.join(dbDir, "twitter.db");
    console.log(`データベースパス: ${dbPath}`);

    // データベース接続
    const database = new Database(dbPath);

    // WALモードを有効化（パフォーマンス向上）
    database.pragma("journal_mode = WAL");

    // 外部キー制約を有効化
    database.pragma("foreign_keys = ON");

    return database;
  } catch (error) {
    console.error("データベース初期化エラー:", error);

    // エラーが発生した場合、メモリ内データベースを使用（開発用）
    console.warn(
      "メモリ内データベースを使用します（データは永続化されません）"
    );

    try {
      const memoryDb = new Database(":memory:");
      memoryDb.pragma("foreign_keys = ON");
      return memoryDb;
    } catch (memoryError) {
      console.error("メモリデータベース初期化エラー:", memoryError);
      throw new Error("データベース接続に失敗しました");
    }
  }
};

/**
 * データベース接続を取得する
 * @returns {Database.Database} SQLiteデータベース接続
 */
export const getDb = () => {
  if (!db) {
    db = initializeDb();

    // テーブルが存在しない場合は作成
    createTablesIfNotExist(db);
  }

  return db;
};

/**
 * データベースのテーブルを初期化する
 */
export const initDatabase = () => {
  const database = getDb();
  createTablesIfNotExist(database);
  return database;
};

/**
 * 必要なテーブルが存在しない場合に作成する
 * @param {Database.Database} database データベース接続
 */
const createTablesIfNotExist = (database) => {
  // usersテーブル
  database.exec(`
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

  // tweetsテーブル
  database.exec(`
    CREATE TABLE IF NOT EXISTS tweets (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // likesテーブル
  database.exec(`
    CREATE TABLE IF NOT EXISTS likes (
      id TEXT PRIMARY KEY,
      tweet_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      UNIQUE(tweet_id, user_id),
      FOREIGN KEY (tweet_id) REFERENCES tweets (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);

  // repliesテーブル
  database.exec(`
    CREATE TABLE IF NOT EXISTS replies (
      id TEXT PRIMARY KEY,
      content TEXT NOT NULL,
      tweet_id TEXT NOT NULL,
      user_id TEXT NOT NULL,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL,
      FOREIGN KEY (tweet_id) REFERENCES tweets (id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
    )
  `);
};

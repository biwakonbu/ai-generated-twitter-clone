import { getDb } from "../db/database";
import { v4 as uuidv4 } from "uuid";

// 型定義
export interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Tweet {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Like {
  id: string;
  tweetId: string;
  userId: string;
  createdAt: Date;
}

export interface Reply {
  id: string;
  content: string;
  tweetId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

// SQLiteの行型定義
interface UserRow {
  id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  created_at: string;
  updated_at: string;
}

interface TweetRow {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

interface LikeRow {
  id: string;
  tweet_id: string;
  user_id: string;
  created_at: string;
}

interface ReplyRow {
  id: string;
  content: string;
  tweet_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// SQLiteストレージクラス
class SQLiteStorage {
  // ユーザー関連の操作
  async createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    const db = getDb();
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO users (id, username, name, email, password, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      userData.username,
      userData.name,
      userData.email,
      userData.password,
      now,
      now
    );

    return {
      id,
      ...userData,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const db = getDb();
    const stmt = db.prepare("SELECT * FROM users WHERE email = ?");
    const row = stmt.get(email) as UserRow | undefined;

    if (!row) return null;

    return {
      id: row.id,
      username: row.username,
      name: row.name,
      email: row.email,
      password: row.password,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const db = getDb();
    const stmt = db.prepare("SELECT * FROM users WHERE username = ?");
    const row = stmt.get(username) as UserRow | undefined;

    if (!row) return null;

    return {
      id: row.id,
      username: row.username,
      name: row.name,
      email: row.email,
      password: row.password,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  async findUserById(id: string): Promise<User | null> {
    const db = getDb();
    const stmt = db.prepare("SELECT * FROM users WHERE id = ?");
    const row = stmt.get(id) as UserRow | undefined;

    if (!row) return null;

    return {
      id: row.id,
      username: row.username,
      name: row.name,
      email: row.email,
      password: row.password,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  // ツイート関連の操作
  async createTweet(
    tweetData: Omit<Tweet, "id" | "createdAt" | "updatedAt">
  ): Promise<Tweet> {
    const db = getDb();
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO tweets (id, content, user_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?)
    `);

    stmt.run(id, tweetData.content, tweetData.userId, now, now);

    return {
      id,
      content: tweetData.content,
      userId: tweetData.userId,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  async getTweets(): Promise<Tweet[]> {
    const db = getDb();
    const stmt = db.prepare(`
      SELECT * FROM tweets
      ORDER BY created_at DESC
    `);

    const rows = stmt.all() as TweetRow[];

    return rows.map((row) => ({
      id: row.id,
      content: row.content,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  }

  async getTweetsByUserId(userId: string): Promise<Tweet[]> {
    const db = getDb();
    const stmt = db.prepare(`
      SELECT * FROM tweets
      WHERE user_id = ?
      ORDER BY created_at DESC
    `);

    const rows = stmt.all(userId) as TweetRow[];

    return rows.map((row) => ({
      id: row.id,
      content: row.content,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  }

  async getTweetById(id: string): Promise<Tweet | null> {
    const db = getDb();
    const stmt = db.prepare("SELECT * FROM tweets WHERE id = ?");
    const row = stmt.get(id) as TweetRow | undefined;

    if (!row) return null;

    return {
      id: row.id,
      content: row.content,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    };
  }

  // いいね関連の操作
  async createLike(userId: string, tweetId: string): Promise<Like> {
    const db = getDb();
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO likes (id, tweet_id, user_id, created_at)
      VALUES (?, ?, ?, ?)
    `);

    stmt.run(id, tweetId, userId, now);

    return {
      id,
      tweetId,
      userId,
      createdAt: new Date(now),
    };
  }

  async deleteLike(userId: string, tweetId: string): Promise<void> {
    const db = getDb();
    const stmt = db.prepare(`
      DELETE FROM likes
      WHERE user_id = ? AND tweet_id = ?
    `);

    stmt.run(userId, tweetId);
  }

  async getLikesByTweetId(tweetId: string): Promise<Like[]> {
    const db = getDb();
    const stmt = db.prepare(`
      SELECT * FROM likes
      WHERE tweet_id = ?
    `);

    const rows = stmt.all(tweetId) as LikeRow[];

    return rows.map((row) => ({
      id: row.id,
      tweetId: row.tweet_id,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
    }));
  }

  async getLikesByUserId(userId: string): Promise<Like[]> {
    const db = getDb();
    const stmt = db.prepare(`
      SELECT * FROM likes
      WHERE user_id = ?
    `);

    const rows = stmt.all(userId) as LikeRow[];

    return rows.map((row) => ({
      id: row.id,
      tweetId: row.tweet_id,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
    }));
  }

  async hasUserLikedTweet(userId: string, tweetId: string): Promise<boolean> {
    const db = getDb();
    const stmt = db.prepare(`
      SELECT 1 FROM likes
      WHERE user_id = ? AND tweet_id = ?
      LIMIT 1
    `);

    const result = stmt.get(userId, tweetId);
    return !!result;
  }

  // リプライ関連の操作
  async createReply(
    replyData: Omit<Reply, "id" | "createdAt" | "updatedAt">
  ): Promise<Reply> {
    const db = getDb();
    const id = uuidv4();
    const now = new Date().toISOString();

    const stmt = db.prepare(`
      INSERT INTO replies (id, content, tweet_id, user_id, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?)
    `);

    stmt.run(
      id,
      replyData.content,
      replyData.tweetId,
      replyData.userId,
      now,
      now
    );

    return {
      id,
      content: replyData.content,
      tweetId: replyData.tweetId,
      userId: replyData.userId,
      createdAt: new Date(now),
      updatedAt: new Date(now),
    };
  }

  async getRepliesByTweetId(tweetId: string): Promise<Reply[]> {
    const db = getDb();
    const stmt = db.prepare(`
      SELECT * FROM replies
      WHERE tweet_id = ?
      ORDER BY created_at ASC
    `);

    const rows = stmt.all(tweetId) as ReplyRow[];

    return rows.map((row) => ({
      id: row.id,
      content: row.content,
      tweetId: row.tweet_id,
      userId: row.user_id,
      createdAt: new Date(row.created_at),
      updatedAt: new Date(row.updated_at),
    }));
  }
}

export const sqliteStorage = new SQLiteStorage();

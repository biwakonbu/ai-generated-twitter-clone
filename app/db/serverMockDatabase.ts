/* server-only */

import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

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

// サーバーサイドモックデータベース
class ServerMockDatabaseClient {
  private users: User[] = [];
  private tweets: Tweet[] = [];
  private likes: Like[] = [];
  private replies: Reply[] = [];
  private initialized = false;
  private dbPath: string;

  constructor() {
    this.dbPath = path.join(process.cwd(), "mock_db.json");
    this.init();
  }

  private init() {
    if (this.initialized) return;

    try {
      if (fs.existsSync(this.dbPath)) {
        const data = JSON.parse(fs.readFileSync(this.dbPath, "utf8"));
        this.users = data.users || [];
        this.tweets = data.tweets || [];
        this.likes = data.likes || [];
        this.replies = data.replies || [];
      }
      this.initialized = true;
    } catch (error) {
      console.error("サーバーモックデータベース初期化エラー:", error);
      // エラーが発生してもデフォルト値で初期化を続行
      this.initialized = true;
    }
  }

  private save() {
    try {
      const data = {
        users: this.users,
        tweets: this.tweets,
        likes: this.likes,
        replies: this.replies,
      };
      fs.writeFileSync(this.dbPath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error("サーバーモックデータベース保存エラー:", error);
    }
  }

  // ユーザー関連の操作
  async createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    const now = new Date();
    const newUser: User = {
      id: uuidv4(),
      ...userData,
      createdAt: now,
      updatedAt: now,
    };

    this.users.push(newUser);
    this.save();

    return newUser;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = this.users.find((u) => u.email === email);
    return user || null;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user = this.users.find((u) => u.username === username);
    return user || null;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = this.users.find((u) => u.id === id);
    return user || null;
  }

  // ツイート関連の操作
  async createTweet(
    tweetData: Omit<Tweet, "id" | "createdAt" | "updatedAt">
  ): Promise<Tweet> {
    const now = new Date();
    const newTweet: Tweet = {
      id: uuidv4(),
      ...tweetData,
      createdAt: now,
      updatedAt: now,
    };

    this.tweets.push(newTweet);
    this.save();

    return newTweet;
  }

  async getTweets(): Promise<Tweet[]> {
    return [...this.tweets].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTweetsByUserId(userId: string): Promise<Tweet[]> {
    return this.tweets
      .filter((t) => t.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  async getTweetById(id: string): Promise<Tweet | null> {
    const tweet = this.tweets.find((t) => t.id === id);
    return tweet || null;
  }

  // いいね関連の操作
  async createLike(userId: string, tweetId: string): Promise<Like> {
    // 既存のいいねをチェック
    const existingLike = this.likes.find(
      (like) => like.userId === userId && like.tweetId === tweetId
    );

    if (existingLike) {
      return existingLike;
    }

    const newLike: Like = {
      id: uuidv4(),
      userId,
      tweetId,
      createdAt: new Date(),
    };

    this.likes.push(newLike);
    this.save();

    return newLike;
  }

  async deleteLike(userId: string, tweetId: string): Promise<void> {
    this.likes = this.likes.filter(
      (like) => !(like.userId === userId && like.tweetId === tweetId)
    );
    this.save();
  }

  async getLikesByTweetId(tweetId: string): Promise<Like[]> {
    return this.likes.filter((like) => like.tweetId === tweetId);
  }

  async getLikesByUserId(userId: string): Promise<Like[]> {
    return this.likes.filter((like) => like.userId === userId);
  }

  async hasUserLikedTweet(userId: string, tweetId: string): Promise<boolean> {
    return this.likes.some(
      (like) => like.userId === userId && like.tweetId === tweetId
    );
  }

  // リプライ関連の操作
  async createReply(
    replyData: Omit<Reply, "id" | "createdAt" | "updatedAt">
  ): Promise<Reply> {
    const now = new Date();
    const newReply: Reply = {
      id: uuidv4(),
      ...replyData,
      createdAt: now,
      updatedAt: now,
    };

    this.replies.push(newReply);
    this.save();

    return newReply;
  }

  async getRepliesByTweetId(tweetId: string): Promise<Reply[]> {
    return this.replies
      .filter((reply) => reply.tweetId === tweetId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }

  // データベースを初期化するメソッド（テスト用）
  async initDatabase() {
    // テスト用ユーザーを作成
    if (this.users.length === 0) {
      await this.createUser({
        username: "testuser",
        name: "Test User",
        email: "test@example.com",
        password:
          "$2a$10$sMzRxS5xOcCQeGz1iFsKj.XMRYDRXrCyAx9NLbN1HBu8cVWcnH.bG", // "password"
      });
    }
    return true;
  }
}

// モックデータベースのインスタンスを作成（シングルトン）
export const serverMockDatabase = new ServerMockDatabaseClient();

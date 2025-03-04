import fs from "fs";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import bcrypt from "bcryptjs";

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

// データ型と保存場所
type StorageData = {
  users: User[];
  tweets: Tweet[];
  likes: Like[];
  replies: Reply[];
};

// シングルトンパターンでサーバーストレージを実装
class ServerStorage {
  private static instance: ServerStorage;
  private data: StorageData = {
    users: [],
    tweets: [],
    likes: [],
    replies: [],
  };
  private dbPath: string;
  private initialized = false;

  private constructor() {
    this.dbPath = path.join(process.cwd(), "server_db.json");
    this.init();
  }

  public static getInstance(): ServerStorage {
    if (!ServerStorage.instance) {
      ServerStorage.instance = new ServerStorage();
    }
    return ServerStorage.instance;
  }

  private init() {
    if (this.initialized) return;

    try {
      if (fs.existsSync(this.dbPath)) {
        const rawData = fs.readFileSync(this.dbPath, "utf8");
        const parsedData = JSON.parse(rawData);
        this.data = parsedData;
      }
      this.initialized = true;
    } catch (error) {
      console.error("サーバーストレージ初期化エラー:", error);
      // エラーでも継続
      this.initialized = true;
    }
  }

  private save() {
    try {
      fs.writeFileSync(this.dbPath, JSON.stringify(this.data, null, 2));
    } catch (error) {
      console.error("サーバーストレージ保存エラー:", error);
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

    this.data.users.push(newUser);
    this.save();
    return newUser;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const user = this.data.users.find((u) => u.email === email);
    return user || null;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    const user = this.data.users.find((u) => u.username === username);
    return user || null;
  }

  async findUserById(id: string): Promise<User | null> {
    const user = this.data.users.find((u) => u.id === id);
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

    this.data.tweets.push(newTweet);
    this.save();
    return newTweet;
  }

  async getTweets(): Promise<Tweet[]> {
    return [...this.data.tweets].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }

  async getTweetsByUserId(userId: string): Promise<Tweet[]> {
    return this.data.tweets
      .filter((t) => t.userId === userId)
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
  }

  async getTweetById(id: string): Promise<Tweet | null> {
    const tweet = this.data.tweets.find((t) => t.id === id);
    return tweet || null;
  }

  // いいね関連の操作
  async createLike(userId: string, tweetId: string): Promise<Like> {
    // 既存のいいねをチェック
    const existingLike = this.data.likes.find(
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

    this.data.likes.push(newLike);
    this.save();
    return newLike;
  }

  async deleteLike(userId: string, tweetId: string): Promise<void> {
    this.data.likes = this.data.likes.filter(
      (like) => !(like.userId === userId && like.tweetId === tweetId)
    );
    this.save();
  }

  async getLikesByTweetId(tweetId: string): Promise<Like[]> {
    return this.data.likes.filter((like) => like.tweetId === tweetId);
  }

  async getLikesByUserId(userId: string): Promise<Like[]> {
    return this.data.likes.filter((like) => like.userId === userId);
  }

  async hasUserLikedTweet(userId: string, tweetId: string): Promise<boolean> {
    return this.data.likes.some(
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

    this.data.replies.push(newReply);
    this.save();
    return newReply;
  }

  async getRepliesByTweetId(tweetId: string): Promise<Reply[]> {
    return this.data.replies
      .filter((reply) => reply.tweetId === tweetId)
      .sort(
        (a, b) =>
          new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      );
  }

  // データベース初期化（テスト用ユーザー作成）
  async initDatabase(): Promise<boolean> {
    try {
      // テスト用ユーザーを作成（存在しない場合のみ）
      if (this.data.users.length === 0) {
        const hashedPassword = await bcrypt.hash("password", 10);
        await this.createUser({
          username: "testuser",
          name: "Test User",
          email: "test@example.com",
          password: hashedPassword,
        });
        console.log("テストユーザーが作成されました");
      }
      return true;
    } catch (error) {
      console.error("データベース初期化エラー:", error);
      return false;
    }
  }
}

// サーバーストレージのシングルトンインスタンスをエクスポート
export const serverStorage = ServerStorage.getInstance();

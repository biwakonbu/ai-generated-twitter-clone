"use client";

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

// モックデータベース
class MockDatabaseClient {
  private users: User[] = [];
  private tweets: Tweet[] = [];
  private likes: Like[] = [];
  private replies: Reply[] = [];
  private initialized = false;

  constructor() {
    this.init();
  }

  private init() {
    if (this.initialized) return;

    try {
      // サーバーサイドの場合は何もしない
      if (typeof window === "undefined") {
        this.initialized = true;
        return;
      }

      // ローカルストレージからデータを復元
      const usersData = localStorage.getItem("mock_db_users");
      const tweetsData = localStorage.getItem("mock_db_tweets");
      const likesData = localStorage.getItem("mock_db_likes");
      const repliesData = localStorage.getItem("mock_db_replies");

      if (usersData) this.users = JSON.parse(usersData);
      if (tweetsData) this.tweets = JSON.parse(tweetsData);
      if (likesData) this.likes = JSON.parse(likesData);
      if (repliesData) this.replies = JSON.parse(repliesData);

      this.initialized = true;
    } catch (error) {
      console.error("モックデータベース初期化エラー:", error);
    }
  }

  private save() {
    // サーバーサイドの場合は何もしない
    if (typeof window === "undefined") return;

    try {
      localStorage.setItem("mock_db_users", JSON.stringify(this.users));
      localStorage.setItem("mock_db_tweets", JSON.stringify(this.tweets));
      localStorage.setItem("mock_db_likes", JSON.stringify(this.likes));
      localStorage.setItem("mock_db_replies", JSON.stringify(this.replies));
    } catch (error) {
      console.error("モックデータベース保存エラー:", error);
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
}

export const mockDatabase = new MockDatabaseClient();

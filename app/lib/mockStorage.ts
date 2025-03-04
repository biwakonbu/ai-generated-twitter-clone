"use client";

import { User, Tweet, Like, Reply, mockDatabase } from "../db/mockDatabase";
import { serverMockDatabase } from "../db/serverMockDatabase";

// 環境に応じたデータベースを選択
const getDatabase = () => {
  if (typeof window === "undefined") {
    // サーバーサイドならサーバーモックを使用
    return serverMockDatabase;
  } else {
    // クライアントサイドならクライアントモックを使用
    return mockDatabase;
  }
};

// モックストレージクラス
class MockStorage {
  // ユーザー関連の操作
  async createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    try {
      const db = getDatabase();
      return await db.createUser(userData);
    } catch (error) {
      console.error("ユーザー作成エラー:", error);
      throw error;
    }
  }

  async findUserByEmail(email: string): Promise<User | null> {
    try {
      const db = getDatabase();
      return await db.findUserByEmail(email);
    } catch (error) {
      console.error("メールでのユーザー検索エラー:", error);
      return null;
    }
  }

  async findUserByUsername(username: string): Promise<User | null> {
    try {
      const db = getDatabase();
      return await db.findUserByUsername(username);
    } catch (error) {
      console.error("ユーザー名でのユーザー検索エラー:", error);
      return null;
    }
  }

  async findUserById(id: string): Promise<User | null> {
    try {
      const db = getDatabase();
      return await db.findUserById(id);
    } catch (error) {
      console.error("IDでのユーザー検索エラー:", error);
      return null;
    }
  }

  // ツイート関連の操作
  async createTweet(
    tweetData: Omit<Tweet, "id" | "createdAt" | "updatedAt">
  ): Promise<Tweet> {
    try {
      const db = getDatabase();
      return await db.createTweet(tweetData);
    } catch (error) {
      console.error("ツイート作成エラー:", error);
      throw error;
    }
  }

  async getTweets(): Promise<Tweet[]> {
    try {
      const db = getDatabase();
      return await db.getTweets();
    } catch (error) {
      console.error("ツイート取得エラー:", error);
      return [];
    }
  }

  async getTweetsByUserId(userId: string): Promise<Tweet[]> {
    try {
      const db = getDatabase();
      return await db.getTweetsByUserId(userId);
    } catch (error) {
      console.error("ユーザーIDでのツイート取得エラー:", error);
      return [];
    }
  }

  async getTweetById(id: string): Promise<Tweet | null> {
    try {
      const db = getDatabase();
      return await db.getTweetById(id);
    } catch (error) {
      console.error("IDでのツイート取得エラー:", error);
      return null;
    }
  }

  // いいね関連の操作
  async createLike(userId: string, tweetId: string): Promise<Like> {
    try {
      const db = getDatabase();
      return await db.createLike(userId, tweetId);
    } catch (error) {
      console.error("いいね作成エラー:", error);
      throw error;
    }
  }

  async deleteLike(userId: string, tweetId: string): Promise<void> {
    try {
      const db = getDatabase();
      return await db.deleteLike(userId, tweetId);
    } catch (error) {
      console.error("いいね削除エラー:", error);
      throw error;
    }
  }

  async getLikesByTweetId(tweetId: string): Promise<Like[]> {
    try {
      const db = getDatabase();
      return await db.getLikesByTweetId(tweetId);
    } catch (error) {
      console.error("ツイートIDでのいいね取得エラー:", error);
      return [];
    }
  }

  async getLikesByUserId(userId: string): Promise<Like[]> {
    try {
      const db = getDatabase();
      return await db.getLikesByUserId(userId);
    } catch (error) {
      console.error("ユーザーIDでのいいね取得エラー:", error);
      return [];
    }
  }

  async hasUserLikedTweet(userId: string, tweetId: string): Promise<boolean> {
    try {
      const db = getDatabase();
      return await db.hasUserLikedTweet(userId, tweetId);
    } catch (error) {
      console.error("いいねチェックエラー:", error);
      return false;
    }
  }

  // リプライ関連の操作
  async createReply(
    replyData: Omit<Reply, "id" | "createdAt" | "updatedAt">
  ): Promise<Reply> {
    try {
      const db = getDatabase();
      return await db.createReply(replyData);
    } catch (error) {
      console.error("リプライ作成エラー:", error);
      throw error;
    }
  }

  async getRepliesByTweetId(tweetId: string): Promise<Reply[]> {
    try {
      const db = getDatabase();
      return await db.getRepliesByTweetId(tweetId);
    } catch (error) {
      console.error("ツイートIDでのリプライ取得エラー:", error);
      return [];
    }
  }

  // データベース初期化（サーバーサイドのみ）
  async initDatabase() {
    try {
      if (typeof window === "undefined") {
        return await serverMockDatabase.initDatabase();
      }
      return true;
    } catch (error) {
      console.error("データベース初期化エラー:", error);
      return false;
    }
  }
}

export const mockStorage = new MockStorage();

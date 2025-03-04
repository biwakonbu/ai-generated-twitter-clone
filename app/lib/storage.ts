import { sqliteStorage } from "./sqliteStorage";

// SQLiteStorageに切り替えるため、エクスポートを変更
export const storage = sqliteStorage;

// 古いInMemoryStorage実装は以下にコメントアウトして保持
/*
interface User {
  id: string;
  username: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

interface Tweet {
  id: string;
  content: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

class InMemoryStorage {
  private users: Map<string, User> = new Map();
  private tweets: Map<string, Tweet> = new Map();

  // ユーザー関連の操作
  async createUser(
    userData: Omit<User, "id" | "createdAt" | "updatedAt">
  ): Promise<User> {
    const id = crypto.randomUUID();
    const now = new Date();
    const user: User = {
      ...userData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(id, user);
    return user;
  }

  async findUserByEmail(email: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findUserByUsername(username: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  }

  // ツイート関連の操作
  async createTweet(
    tweetData: Omit<Tweet, "id" | "createdAt" | "updatedAt">
  ): Promise<Tweet> {
    const id = crypto.randomUUID();
    const now = new Date();
    const tweet: Tweet = {
      ...tweetData,
      id,
      createdAt: now,
      updatedAt: now,
    };
    this.tweets.set(id, tweet);
    return tweet;
  }

  async getTweets(): Promise<Tweet[]> {
    return Array.from(this.tweets.values()).sort(
      (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
    );
  }

  async getTweetsByUserId(userId: string): Promise<Tweet[]> {
    return Array.from(this.tweets.values())
      .filter((tweet) => tweet.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }
}

export const storage = new InMemoryStorage();
*/

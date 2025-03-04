"use client";

import { useEffect, useState } from "react";
import {
  ChatBubbleOvalLeftIcon,
  ArrowPathRoundedSquareIcon,
  HeartIcon as HeartOutlineIcon,
  ChartBarIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";
import Link from "next/link";

interface Tweet {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  likes?: number;
  isLiked?: boolean;
}

interface TweetListProps {
  userId?: string; // 特定のユーザーのツイートのみを表示する場合に使用
}

export default function TweetList({ userId }: TweetListProps = {}) {
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchTweets = async () => {
    try {
      setIsLoading(true);
      // ユーザーIDが指定されている場合はそのユーザーのツイートのみを取得
      const url = userId ? `/api/tweets?userId=${userId}` : "/api/tweets";
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error("ツイートの取得に失敗しました");
      }
      const data = await response.json();
      // 各ツイートにいいね数と、ユーザーがいいねしたかどうかを追加
      const tweetsWithLikes = data.map((tweet: Tweet) => ({
        ...tweet,
        likes: tweet.likes || 0,
        isLiked: tweet.isLiked || false,
      }));
      setTweets(tweetsWithLikes);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // 最初のロード時にツイートを取得
  useEffect(() => {
    fetchTweets();
  }, [userId]);

  // リフレッシュ機能
  const handleRefresh = () => {
    setIsRefreshing(true);
    fetchTweets();
  };

  const handleLike = async (tweetId: string) => {
    try {
      // 現在のツイートの状態を取得
      const tweetIndex = tweets.findIndex((t) => t.id === tweetId);
      if (tweetIndex === -1) return;

      const currentTweet = tweets[tweetIndex];
      const isCurrentlyLiked = currentTweet.isLiked;

      // 即時に UI を更新（オプティミスティック UI 更新）
      const updatedTweets = [...tweets];
      updatedTweets[tweetIndex] = {
        ...currentTweet,
        isLiked: !isCurrentlyLiked,
        likes: (currentTweet.likes || 0) + (isCurrentlyLiked ? -1 : 1),
      };
      setTweets(updatedTweets);

      // APIリクエスト
      const response = await fetch(`/api/tweets/${tweetId}/like`, {
        method: isCurrentlyLiked ? "DELETE" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("いいねの更新に失敗しました");
      }

      // 成功時の処理（すでにUIは更新済み）
    } catch (error) {
      // エラー時は元の状態に戻す
      console.error("いいね処理でエラーが発生しました:", error);
      fetchTweets(); // エラー時は全体を再取得
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds}秒前`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)}分前`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)}時間前`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)}日前`;
    }
  };

  // ローディング状態表示
  if (isLoading && !isRefreshing) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="text-gray-600 dark:text-gray-400">
          ツイートを読み込み中...
        </p>
      </div>
    );
  }

  // エラー表示
  if (error && !isRefreshing) {
    return (
      <div className="flex flex-col items-center justify-center p-6 space-y-4">
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-4 rounded-lg">
          <p className="font-bold">エラーが発生しました</p>
          <p>{error}</p>
        </div>
        <button
          onClick={fetchTweets}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors"
        >
          再試行
        </button>
      </div>
    );
  }

  // ツイートが空の場合の表示
  if (tweets.length === 0 && !isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 space-y-4 border-b dark:border-dark-border">
        <div className="text-center">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            まだツイートがありません
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            {userId
              ? "このユーザーはまだツイートしていません。"
              : "最初のツイートを投稿してみましょう！"}
          </p>
        </div>
        {!userId && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-full transition-colors"
          >
            ツイートを作成
          </button>
        )}
      </div>
    );
  }

  // メインのツイートリスト表示
  return (
    <div className="divide-y divide-gray-200 dark:divide-dark-border">
      {/* リフレッシュボタン */}
      <div className="flex justify-between items-center p-4 sticky top-0 bg-white dark:bg-dark-bg z-10 border-b dark:border-dark-border">
        <h2 className="text-xl font-bold">
          {userId ? "ユーザーのツイート" : "最新ツイート"}
        </h2>
        <button
          onClick={handleRefresh}
          className="text-blue-500 hover:bg-blue-50 dark:hover:bg-dark-hover p-2 rounded-full transition-colors"
          disabled={isRefreshing}
        >
          <ArrowPathRoundedSquareIcon
            className={`h-5 w-5 ${isRefreshing ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* ツイートリスト */}
      {tweets.map((tweet) => (
        <div
          key={tweet.id}
          className="p-4 hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors"
        >
          <Link href={`/tweet/${tweet.id}`} className="block">
            <div className="flex space-x-4">
              <div className="flex-shrink-0">
                <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700">
                  {/* ユーザーアイコン */}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center mb-1">
                  <Link
                    href={`/profile/${tweet.userId}`}
                    className="font-bold text-gray-900 dark:text-white hover:underline"
                    onClick={(e) => e.stopPropagation()}
                  >
                    ユーザー
                  </Link>
                  <span className="text-gray-500 dark:text-gray-400 ml-2 text-sm">
                    @{tweet.userId.substring(0, 8)}
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 mx-1 text-sm">
                    ·
                  </span>
                  <span className="text-gray-500 dark:text-gray-400 text-sm">
                    {formatDate(tweet.createdAt)}
                  </span>
                </div>
                <p className="text-gray-900 dark:text-white whitespace-pre-wrap break-words mb-2">
                  {tweet.content}
                </p>
                <div className="flex justify-between text-gray-500 dark:text-gray-400 max-w-md">
                  <button className="flex items-center space-x-1 group">
                    <ChatBubbleOvalLeftIcon className="h-5 w-5 group-hover:text-blue-500" />
                    <span className="text-xs group-hover:text-blue-500">0</span>
                  </button>
                  <button className="flex items-center space-x-1 group">
                    <ArrowPathRoundedSquareIcon className="h-5 w-5 group-hover:text-green-500" />
                    <span className="text-xs group-hover:text-green-500">
                      0
                    </span>
                  </button>
                  <button
                    className="flex items-center space-x-1 group"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLike(tweet.id);
                    }}
                  >
                    {tweet.isLiked ? (
                      <HeartSolidIcon className="h-5 w-5 text-pink-500" />
                    ) : (
                      <HeartOutlineIcon className="h-5 w-5 group-hover:text-pink-500" />
                    )}
                    <span
                      className={`text-xs ${
                        tweet.isLiked
                          ? "text-pink-500"
                          : "group-hover:text-pink-500"
                      }`}
                    >
                      {tweet.likes}
                    </span>
                  </button>
                  <button className="flex items-center space-x-1 group">
                    <ChartBarIcon className="h-5 w-5 group-hover:text-blue-500" />
                    <span className="text-xs">0</span>
                  </button>
                  <button className="flex items-center space-x-1 group">
                    <ArrowUpTrayIcon className="h-5 w-5 group-hover:text-blue-500" />
                  </button>
                </div>
              </div>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
}

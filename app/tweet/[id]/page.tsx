"use client";

import { useState, useEffect } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import {
  ChatBubbleOvalLeftIcon,
  ArrowPathRoundedSquareIcon,
  HeartIcon as HeartOutlineIcon,
  ChartBarIcon,
  ArrowUpTrayIcon,
} from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolidIcon } from "@heroicons/react/24/solid";

interface Tweet {
  id: string;
  content: string;
  userId: string;
  createdAt: string;
  likes?: number;
  isLiked?: boolean;
}

interface Reply {
  id: string;
  content: string;
  userId: string;
  tweetId: string;
  createdAt: string;
}

export default function TweetPage({ params }: { params: { id: string } }) {
  const [tweet, setTweet] = useState<Tweet | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [replyContent, setReplyContent] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  // 仮のユーザーID (後で認証システムと連携)
  const temporaryUserId = "temp-user-1";

  useEffect(() => {
    const fetchTweetAndReplies = async () => {
      try {
        // ツイートの取得
        // 注: 実際のAPIエンドポイントが必要です
        // const response = await fetch(`/api/tweets/${params.id}`);
        // if (!response.ok) throw new Error("ツイートの取得に失敗しました");
        // const tweetData = await response.json();

        // 仮のデータ (APIが実装されるまで)
        const tweetData = {
          id: params.id,
          content:
            "これはサンプルツイートです。詳細ページのデモ用に表示しています。",
          userId: "demo-user",
          createdAt: new Date().toISOString(),
          likes: 5,
          isLiked: false,
        };

        setTweet(tweetData);

        // リプライの取得
        // 注: 実際のAPIエンドポイントが必要です
        // const repliesResponse = await fetch(`/api/tweets/${params.id}/replies`);
        // if (!repliesResponse.ok) throw new Error("リプライの取得に失敗しました");
        // const repliesData = await repliesResponse.json();

        // 仮のデータ (APIが実装されるまで)
        const repliesData = [
          {
            id: "reply-1",
            content: "素晴らしいツイートですね！",
            userId: "user-1",
            tweetId: params.id,
            createdAt: new Date().toISOString(),
          },
          {
            id: "reply-2",
            content: "私もそう思います。",
            userId: "user-2",
            tweetId: params.id,
            createdAt: new Date(Date.now() - 3600000).toISOString(),
          },
        ];

        setReplies(repliesData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "エラーが発生しました");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTweetAndReplies();
  }, [params.id]);

  const handleLike = async () => {
    if (!tweet) return;

    // UIを即時更新
    setTweet({
      ...tweet,
      isLiked: !tweet.isLiked,
      likes: tweet.isLiked ? (tweet.likes || 1) - 1 : (tweet.likes || 0) + 1,
    });

    // 注: 実際のAPIエンドポイントが必要です
    // try {
    //   const response = await fetch(`/api/tweets/${tweet.id}/like`, {
    //     method: tweet.isLiked ? "DELETE" : "POST",
    //   });
    //   if (!response.ok) throw new Error("いいねの更新に失敗しました");
    // } catch (err) {
    //   console.error("いいねエラー:", err);
    //   // エラー時は元の状態に戻す
    //   setTweet({
    //     ...tweet,
    //     isLiked: !tweet.isLiked,
    //     likes: tweet.isLiked ? (tweet.likes || 0) + 1 : (tweet.likes || 1) - 1
    //   });
    // }
  };

  const handleSubmitReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyContent.trim() || !tweet) return;

    setIsSubmitting(true);

    try {
      // 注: 実際のAPIエンドポイントが必要です
      // const response = await fetch(`/api/tweets/${tweet.id}/replies`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     content: replyContent,
      //     userId: temporaryUserId,
      //   }),
      // });

      // if (!response.ok) throw new Error("リプライの投稿に失敗しました");
      // const newReply = await response.json();

      // 仮のデータ (APIが実装されるまで)
      const newReply = {
        id: `reply-${Date.now()}`,
        content: replyContent,
        userId: temporaryUserId,
        tweetId: tweet.id,
        createdAt: new Date().toISOString(),
      };

      setReplies([newReply, ...replies]);
      setReplyContent("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("ja-JP", options);
  };

  if (isLoading) {
    return (
      <div className="p-4 text-center dark:text-gray-300">
        <div className="flex justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        </div>
        <p className="mt-2">ツイートを読み込み中...</p>
      </div>
    );
  }

  if (error || !tweet) {
    return (
      <div className="p-4 text-red-500 text-center">
        {error || "ツイートが見つかりませんでした"}
      </div>
    );
  }

  return (
    <div>
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm border-b border-gray-200 dark:border-dark-border transition-colors duration-300">
        <div className="flex items-center p-4">
          <Link
            href="/"
            className="mr-6 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <h1 className="text-xl font-bold dark:text-white">ツイート</h1>
        </div>
      </header>

      {/* ツイート詳細 */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-border">
        <div className="flex space-x-3">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
          </div>
          <div className="flex-1">
            <div className="flex flex-col">
              <div className="flex items-center">
                <p className="font-bold text-gray-900 dark:text-white">
                  ユーザー名
                </p>
                <p className="ml-1 text-gray-500 dark:text-gray-400">
                  @{tweet.userId}
                </p>
              </div>
              <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                {tweet.content}
              </p>
              <p className="mt-4 text-gray-500 dark:text-gray-400">
                {formatDate(tweet.createdAt)}
              </p>

              <div className="flex mt-4 pt-4 border-t border-gray-200 dark:border-dark-border">
                <div className="flex space-x-8">
                  <div className="flex items-center">
                    <span className="font-bold dark:text-white mr-1">
                      {replies.length}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      返信
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold dark:text-white mr-1">0</span>
                    <span className="text-gray-500 dark:text-gray-400">
                      リツイート
                    </span>
                  </div>
                  <div className="flex items-center">
                    <span className="font-bold dark:text-white mr-1">
                      {tweet.likes}
                    </span>
                    <span className="text-gray-500 dark:text-gray-400">
                      いいね
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex justify-around mt-2 pt-2 border-t border-gray-200 dark:border-dark-border">
                <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  <ChatBubbleOvalLeftIcon className="h-5 w-5" />
                </button>
                <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors">
                  <ArrowPathRoundedSquareIcon className="h-5 w-5" />
                </button>
                <button
                  className={`flex items-center ${
                    tweet.isLiked
                      ? "text-red-500"
                      : "text-gray-500 dark:text-gray-400 hover:text-red-500"
                  } transition-colors`}
                  onClick={handleLike}
                >
                  {tweet.isLiked ? (
                    <HeartSolidIcon className="h-5 w-5 heart-animation" />
                  ) : (
                    <HeartOutlineIcon className="h-5 w-5" />
                  )}
                </button>
                <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  <ChartBarIcon className="h-5 w-5" />
                </button>
                <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                  <ArrowUpTrayIcon className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* リプライフォーム */}
      <div className="p-4 border-b border-gray-200 dark:border-dark-border">
        <form onSubmit={handleSubmitReply}>
          <div className="flex space-x-3">
            <div className="flex-shrink-0">
              <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
            </div>
            <div className="flex-1">
              <textarea
                className="w-full bg-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none focus:outline-none focus:ring-0 min-h-[80px]"
                placeholder="返信をツイート"
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <button
                  type="submit"
                  disabled={!replyContent.trim() || isSubmitting}
                  className={`px-4 py-2 bg-blue-500 text-white font-bold rounded-full 
                    ${
                      !replyContent.trim() || isSubmitting
                        ? "opacity-50 cursor-not-allowed"
                        : "hover:bg-blue-600"
                    }`}
                >
                  {isSubmitting ? "投稿中..." : "返信"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>

      {/* リプライ一覧 */}
      <div>
        {replies.length === 0 ? (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            まだ返信はありません。最初の返信をしてみましょう！
          </div>
        ) : (
          replies.map((reply) => (
            <div
              key={reply.id}
              className="p-4 border-b border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-dark-hover transition-colors duration-300"
            >
              <div className="flex space-x-3">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700"></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center">
                    <p className="font-bold text-gray-900 dark:text-white">
                      ユーザー名
                    </p>
                    <p className="ml-1 text-gray-500 dark:text-gray-400">
                      @{reply.userId}
                    </p>
                    <span className="mx-1 text-gray-500 dark:text-gray-400">
                      ·
                    </span>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">
                      {formatDate(reply.createdAt)}
                    </p>
                  </div>
                  <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-wrap break-words">
                    {reply.content}
                  </p>
                  <div className="mt-3 flex justify-between max-w-md">
                    <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                      <ChatBubbleOvalLeftIcon className="h-5 w-5 mr-1" />
                      <span className="text-sm">0</span>
                    </button>
                    <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-green-500 transition-colors">
                      <ArrowPathRoundedSquareIcon className="h-5 w-5 mr-1" />
                      <span className="text-sm">0</span>
                    </button>
                    <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-red-500 transition-colors">
                      <HeartOutlineIcon className="h-5 w-5 mr-1" />
                      <span className="text-sm">0</span>
                    </button>
                    <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                      <ChartBarIcon className="h-5 w-5 mr-1" />
                      <span className="text-sm">0</span>
                    </button>
                    <button className="flex items-center text-gray-500 dark:text-gray-400 hover:text-blue-500 transition-colors">
                      <ArrowUpTrayIcon className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

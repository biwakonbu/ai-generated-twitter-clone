"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import LogoutButton from "./components/LogoutButton";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  const [tweetContent, setTweetContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  // セッション状態をデバッグ用に出力（詳細にログを出力）
  useEffect(() => {
    console.log("現在のセッション状態:", { session, status });
    if (status === "loading") {
      console.log("ローディング中...");
    } else if (status === "authenticated") {
      console.log("認証済み:", session);
    } else if (status === "unauthenticated") {
      console.log("未認証");
    }
  }, [session, status]);

  // ツイート投稿関数
  const handleTweet = async () => {
    if (!tweetContent.trim() || isSubmitting) return;

    try {
      setIsSubmitting(true);
      const response = await fetch("/api/tweets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: tweetContent }),
      });

      if (!response.ok) {
        throw new Error("ツイートの投稿に失敗しました");
      }

      // 成功したらテキストエリアをクリアして画面を更新
      setTweetContent("");
      router.refresh();
    } catch (error) {
      console.error("ツイート投稿エラー:", error);
      alert("ツイートの投稿に失敗しました。もう一度お試しください。");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="bg-white dark:bg-dark-bg">
      <div className="twitter-container py-4">
        <div className="twitter-header dark:border-dark-border">
          <h1>ホーム</h1>
        </div>

        {status === "loading" ? (
          <div className="flex justify-center py-10">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"></div>
          </div>
        ) : session ? (
          <>
            <div className="my-4 border-b border-gray-200 dark:border-dark-border pb-4">
              <div className="flex">
                <div className="twitter-avatar">
                  {session.user?.name?.charAt(0).toUpperCase() || "U"}
                </div>
                <div className="flex-1">
                  <textarea
                    placeholder="いまどうしてる？"
                    className="w-full resize-none rounded-lg border border-gray-200 dark:border-dark-border p-2 focus:border-blue-500 focus:outline-none bg-white dark:bg-dark-surface dark:text-dark-text"
                    rows={3}
                    value={tweetContent}
                    onChange={(e) => setTweetContent(e.target.value)}
                    maxLength={280}
                  ></textarea>
                  <div className="mt-2 flex justify-between">
                    <div className="flex space-x-2 text-twitter-blue">
                      <button className="rounded-full p-2 hover:bg-blue-50 dark:hover:bg-dark-hover">
                        <svg
                          className="h-5 w-5"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M19.75 2H4.25C3.01 2 2 3.01 2 4.25v15.5C2 20.99 3.01 22 4.25 22h15.5c1.24 0 2.25-1.01 2.25-2.25V4.25C22 3.01 20.99 2 19.75 2zM4.25 3.5h15.5c.413 0 .75.337.75.75v9.676l-3.858-3.858c-.14-.14-.33-.22-.53-.22h-.003c-.2 0-.393.08-.532.224l-4.317 4.384-1.813-1.806c-.14-.14-.33-.22-.53-.22-.193-.03-.395.08-.535.227L3.5 17.642V4.25c0-.413.337-.75.75-.75zm-.744 16.28l5.418-5.534 6.282 6.254H4.25c-.402 0-.727-.322-.744-.72zm16.244.72h-2.42l-5.007-4.987 3.792-3.85 4.385 4.384v3.703c0 .413-.337.75-.75.75z"></path>
                        </svg>
                      </button>
                      <div className="flex items-center text-sm text-gray-500 dark:text-dark-text-secondary">
                        {tweetContent.length}/280
                      </div>
                    </div>
                    <button
                      className={`twitter-button ${
                        !tweetContent.trim() || isSubmitting
                          ? "opacity-50 cursor-not-allowed"
                          : ""
                      }`}
                      onClick={handleTweet}
                      disabled={!tweetContent.trim() || isSubmitting}
                    >
                      {isSubmitting ? "投稿中..." : "ツイートする"}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="twitter-tweet dark:border-dark-border">
              <div className="twitter-avatar">
                {session.user?.name?.charAt(0).toUpperCase() || "U"}
              </div>
              <div className="twitter-tweet-content">
                <div className="flex items-center">
                  <span className="twitter-name dark:text-dark-text">
                    {session.user?.name}
                  </span>
                  <span className="twitter-username dark:text-dark-text-secondary">
                    @
                    {session.user?.username ||
                      session.user?.email?.split("@")[0]}
                  </span>
                </div>
                <p className="twitter-text dark:text-dark-text">
                  ようこそTwitterクローンへ！このアプリはNext.jsとNextAuthを使って構築されています。ツイート、いいね、リツイートなど様々な機能を試してみてください。
                </p>
                <div className="twitter-actions dark:text-dark-text-secondary">
                  <div className="twitter-action">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.616 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
                    </svg>
                    <span>12</span>
                  </div>
                  <div className="twitter-action">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z"></path>
                    </svg>
                    <span>4</span>
                  </div>
                  <div className="twitter-action">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path>
                    </svg>
                    <span>24</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="twitter-tweet dark:border-dark-border">
              <div className="twitter-avatar bg-blue-500">T</div>
              <div className="twitter-tweet-content">
                <div className="flex items-center">
                  <span className="twitter-name dark:text-dark-text">
                    Twitter開発チーム
                  </span>
                  <span className="twitter-username dark:text-dark-text-secondary">
                    @TwitterDev
                  </span>
                </div>
                <p className="twitter-text dark:text-dark-text">
                  Next.jsとTailwind
                  CSSを使ったTwitterクローンのデモへようこそ！このプロジェクトはモダンなWeb開発の学習素材として作成されました。
                </p>
                <div className="twitter-actions dark:text-dark-text-secondary">
                  <div className="twitter-action">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M14.046 2.242l-4.148-.01h-.002c-4.374 0-7.8 3.427-7.8 7.802 0 4.098 3.186 7.206 7.465 7.37v3.828c0 .108.044.286.12.403.142.225.384.347.632.347.138 0 .277-.038.402-.118.264-.168 6.473-4.14 8.088-5.506 1.902-1.616 3.04-3.97 3.043-6.312v-.017c-.006-4.367-3.43-7.787-7.8-7.788zm3.787 12.972c-1.134.96-4.862 3.405-6.772 4.643V16.67c0-.414-.335-.75-.75-.75h-.396c-3.66 0-6.318-2.476-6.318-5.886 0-3.534 2.768-6.302 6.3-6.302l4.147.01h.002c3.532 0 6.3 2.766 6.302 6.296-.003 1.91-.942 3.844-2.514 5.176z"></path>
                    </svg>
                    <span>37</span>
                  </div>
                  <div className="twitter-action">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M23.77 15.67c-.292-.293-.767-.293-1.06 0l-2.22 2.22V7.65c0-2.068-1.683-3.75-3.75-3.75h-5.85c-.414 0-.75.336-.75.75s.336.75.75.75h5.85c1.24 0 2.25 1.01 2.25 2.25v10.24l-2.22-2.22c-.293-.293-.768-.293-1.06 0s-.294.768 0 1.06l3.5 3.5c.145.147.337.22.53.22s.383-.072.53-.22l3.5-3.5c.294-.292.294-.767 0-1.06zm-10.66 3.28H7.26c-1.24 0-2.25-1.01-2.25-2.25V6.46l2.22 2.22c.148.147.34.22.532.22s.384-.073.53-.22c.293-.293.293-.768 0-1.06l-3.5-3.5c-.293-.294-.768-.294-1.06 0l-3.5 3.5c-.294.292-.294.767 0 1.06s.767.293 1.06 0l2.22-2.22V16.7c0 2.068 1.683 3.75 3.75 3.75h5.85c.414 0 .75-.336.75-.75s-.336-.75-.75-.75z"></path>
                    </svg>
                    <span>18</span>
                  </div>
                  <div className="twitter-action">
                    <svg
                      className="mr-2 h-4 w-4"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M12 21.638h-.014C9.403 21.59 1.95 14.856 1.95 8.478c0-3.064 2.525-5.754 5.403-5.754 2.29 0 3.83 1.58 4.646 2.73.814-1.148 2.354-2.73 4.645-2.73 2.88 0 5.404 2.69 5.404 5.755 0 6.376-7.454 13.11-10.037 13.157H12zM7.354 4.225c-2.08 0-3.903 1.988-3.903 4.255 0 5.74 7.034 11.596 8.55 11.658 1.518-.062 8.55-5.917 8.55-11.658 0-2.267-1.823-4.255-3.903-4.255-2.528 0-3.94 2.936-3.952 2.965-.23.562-1.156.562-1.387 0-.014-.03-1.425-2.965-3.954-2.965z"></path>
                    </svg>
                    <span>89</span>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="my-10 rounded-lg border border-gray-200 dark:border-dark-border bg-white dark:bg-dark-surface p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-bold dark:text-dark-text">
              Twitterを始めよう
            </h2>
            <p className="mb-6 text-gray-600 dark:text-dark-text-secondary">
              世界中で今起きていることを見つけよう。会話に参加しましょう。
            </p>
            <div className="flex flex-col space-y-3">
              <Link href="/register" className="twitter-button text-center">
                アカウント登録
              </Link>
              <Link
                href="/login"
                className="rounded-full border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-surface py-2 px-4 text-center font-bold text-black dark:text-dark-text transition-colors hover:bg-gray-50 dark:hover:bg-dark-hover"
              >
                ログイン
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

"use client";

import {
  HomeIcon,
  MagnifyingGlassIcon,
  BellIcon,
  EnvelopeIcon,
  UserIcon,
  HashtagIcon,
  BookmarkIcon,
  EllipsisHorizontalCircleIcon,
  UserGroupIcon,
  SparklesIcon,
  PencilIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import ThemeToggle from "./components/ThemeToggle";
import TweetModal from "./components/TweetModal";
import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isTweetModalOpen, setIsTweetModalOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  const handleTweet = async (content: string) => {
    try {
      const response = await fetch("/api/tweets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error("ツイートの投稿に失敗しました");
      }

      // モーダルを閉じる
      setIsTweetModalOpen(false);

      // 現在のページに応じて適切な更新を行う
      if (pathname === "/") {
        // ホームページの場合は完全な再読み込み
        router.refresh();
      } else {
        // ホームページに遷移
        router.push("/");
      }
    } catch (error) {
      console.error("ツイート投稿エラー:", error);
    }
  };

  return (
    <div className="flex min-h-screen bg-white dark:bg-dark-bg dark:text-dark-text">
      {/* サイドナビゲーション */}
      <nav className="fixed w-20 md:w-64 h-screen border-r border-gray-200 dark:border-dark-border p-2 md:p-4 bg-white dark:bg-dark-bg transition-colors duration-300">
        <div className="flex flex-col space-y-2 md:space-y-4">
          <div className="flex justify-between items-center">
            <div className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-dark-hover w-fit">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 text-twitter-blue"
                fill="currentColor"
              >
                <g>
                  <path d="M23.643 4.937c-.835.37-1.732.62-2.675.733.962-.576 1.7-1.49 2.048-2.578-.9.534-1.897.922-2.958 1.13-.85-.904-2.06-1.47-3.4-1.47-2.572 0-4.658 2.086-4.658 4.66 0 .364.042.718.12 1.06-3.873-.195-7.304-2.05-9.602-4.868-.4.69-.63 1.49-.63 2.342 0 1.616.823 3.043 2.072 3.878-.764-.025-1.482-.234-2.11-.583v.06c0 2.257 1.605 4.14 3.737 4.568-.392.106-.803.162-1.227.162-.3 0-.593-.028-.877-.082.593 1.85 2.313 3.198 4.352 3.234-1.595 1.25-3.604 1.995-5.786 1.995-.376 0-.747-.022-1.112-.065 2.062 1.323 4.51 2.093 7.14 2.093 8.57 0 13.255-7.098 13.255-13.254 0-.2-.005-.402-.014-.602.91-.658 1.7-1.477 2.323-2.41z"></path>
                </g>
              </svg>
            </div>
            <div className="md:block">
              <ThemeToggle />
            </div>
          </div>
          <NavLink
            href="/"
            icon={<HomeIcon className="h-7 w-7" />}
            text="ホーム"
          />
          <NavLink
            href="/following"
            icon={<UserGroupIcon className="h-7 w-7" />}
            text="フォロー中"
          />
          <NavLink
            href="/recommended"
            icon={<SparklesIcon className="h-7 w-7" />}
            text="おすすめ"
          />
          <NavLink
            href="/explore"
            icon={<MagnifyingGlassIcon className="h-7 w-7" />}
            text="話題を検索"
          />
          <NavLink
            href="/notifications"
            icon={<BellIcon className="h-7 w-7" />}
            text="通知"
          />
          <NavLink
            href="/messages"
            icon={<EnvelopeIcon className="h-7 w-7" />}
            text="メッセージ"
          />
          <NavLink
            href="/bookmarks"
            icon={<BookmarkIcon className="h-7 w-7" />}
            text="ブックマーク"
          />
          <NavLink
            href="/lists"
            icon={<HashtagIcon className="h-7 w-7" />}
            text="リスト"
          />
          <NavLink
            href="/profile"
            icon={<UserIcon className="h-7 w-7" />}
            text="プロフィール"
          />
          <NavLink
            href="/more"
            icon={<EllipsisHorizontalCircleIcon className="h-7 w-7" />}
            text="もっと見る"
          />
          <button
            onClick={() => setIsTweetModalOpen(true)}
            className="mt-4 w-full rounded-full bg-twitter-blue px-4 py-3 font-bold text-white hover:bg-twitter-blue-hover hidden md:block transition-colors"
          >
            ツイートする
          </button>
          <button
            onClick={() => setIsTweetModalOpen(true)}
            className="mt-4 w-12 h-12 rounded-full bg-twitter-blue flex items-center justify-center text-white hover:bg-twitter-blue-hover md:hidden transition-colors"
          >
            <PencilIcon className="w-6 h-6" />
          </button>
        </div>
      </nav>
      {/* メインコンテンツ */}
      <main className="ml-20 md:ml-64 flex-1">{children}</main>
      {/* サイドバー（タブレット以上で表示） */}
      <aside className="hidden lg:block w-96 border-l border-gray-200 dark:border-dark-border p-4 bg-white dark:bg-dark-bg transition-colors duration-300">
        <div className="sticky top-0 pt-2 bg-white dark:bg-dark-bg transition-colors duration-300">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 dark:text-dark-text-secondary" />
            </div>
            <input
              type="search"
              placeholder="検索"
              className="bg-gray-100 dark:bg-dark-surface dark:text-dark-text w-full pl-10 pr-4 py-2 rounded-full border-none focus:bg-white dark:focus:bg-dark-surface focus:ring-1 focus:ring-twitter-blue outline-none transition-colors duration-300"
            />
          </div>
          <div className="bg-gray-50 dark:bg-dark-surface rounded-xl p-4 mb-4 transition-colors duration-300">
            <h2 className="text-xl font-bold mb-4 dark:text-dark-text">
              いまどうしてる？
            </h2>
            <div className="space-y-3">
              <TrendingTopic topic="#プログラミング" tweets="1.2万 ツイート" />
              <TrendingTopic topic="#JavaScript" tweets="8,527 ツイート" />
              <TrendingTopic topic="#React" tweets="5,234 ツイート" />
              <TrendingTopic topic="#Next.js" tweets="3,756 ツイート" />
            </div>
            <button className="mt-4 text-twitter-blue font-medium hover:text-twitter-blue-hover">
              さらに表示
            </button>
          </div>
        </div>
      </aside>

      {/* ツイートモーダル */}
      <TweetModal
        isOpen={isTweetModalOpen}
        onClose={() => setIsTweetModalOpen(false)}
        onTweet={handleTweet}
      />
    </div>
  );
}

function NavLink({
  href,
  icon,
  text,
}: {
  href: string;
  icon: React.ReactNode;
  text: string;
}) {
  return (
    <Link
      href={href}
      className="flex items-center space-x-4 rounded-full p-3 text-xl hover:bg-gray-100 dark:hover:bg-dark-hover dark:text-dark-text transition-colors duration-300"
    >
      <div className="flex-shrink-0">{icon}</div>
      <span className="hidden md:inline">{text}</span>
    </Link>
  );
}

function TrendingTopic({ topic, tweets }: { topic: string; tweets: string }) {
  return (
    <div className="hover:bg-gray-100 dark:hover:bg-dark-hover p-2 rounded-lg cursor-pointer transition-colors duration-300">
      <div className="text-sm text-gray-500 dark:text-dark-text-secondary">
        トレンド
      </div>
      <div className="font-bold dark:text-dark-text">{topic}</div>
      <div className="text-sm text-gray-500 dark:text-dark-text-secondary">
        {tweets}
      </div>
    </div>
  );
}

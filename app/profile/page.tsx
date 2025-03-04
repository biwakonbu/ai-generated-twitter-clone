"use client";

import { useState } from "react";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import TweetList from "../components/TweetList";

// プロフィールタブの定義
type ProfileTab = "tweets" | "replies" | "media" | "likes";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<ProfileTab>("tweets");

  // 仮のユーザーデータ (後で実際のデータに置き換え)
  const user = {
    id: "temp-user-1",
    name: "テストユーザー",
    username: "testuser",
    bio: "これはテストユーザーのプロフィールです。TwitterクローンのUI/UX開発中。",
    followersCount: 120,
    followingCount: 45,
    joinedDate: "2023年1月",
    location: "東京, 日本",
    website: "https://example.com",
  };

  return (
    <div className="min-h-screen">
      {/* ヘッダー */}
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm border-b border-gray-200 dark:border-dark-border transition-colors duration-300">
        <div className="flex items-center p-4">
          <Link
            href="/"
            className="mr-6 p-2 rounded-full hover:bg-gray-200 dark:hover:bg-dark-hover transition-colors"
          >
            <ArrowLeftIcon className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-xl font-bold dark:text-white">{user.name}</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {user.username}のツイート
            </p>
          </div>
        </div>
      </header>

      {/* カバー画像 */}
      <div className="h-48 bg-blue-500 dark:bg-blue-700 transition-colors">
        {/* カバー画像はここに */}
      </div>

      {/* プロフィール情報 */}
      <div className="relative px-4 pb-4 border-b border-gray-200 dark:border-dark-border">
        {/* プロフィール画像 - カバー画像に重なる形で配置 */}
        <div className="absolute -top-16 left-4 border-4 border-white dark:border-dark-bg rounded-full h-32 w-32 bg-gray-300 dark:bg-gray-700 transition-colors duration-300">
          {/* プロフィール画像はここに */}
        </div>

        {/* フォローボタン */}
        <div className="flex justify-end mt-3">
          <button className="px-4 py-2 bg-black dark:bg-white text-white dark:text-black font-bold rounded-full hover:bg-gray-800 dark:hover:bg-gray-200 transition-colors">
            フォロー
          </button>
        </div>

        {/* プロフィール詳細 */}
        <div className="mt-16">
          <h2 className="text-xl font-bold dark:text-white">{user.name}</h2>
          <p className="text-gray-500 dark:text-gray-400">@{user.username}</p>

          <p className="mt-3 dark:text-white">{user.bio}</p>

          <div className="mt-3 flex flex-wrap gap-y-2">
            {user.location && (
              <div className="flex items-center text-gray-500 dark:text-gray-400 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M9.69 18.933l.003.001C9.89 19.02 10 19 10 19s.11.02.308-.066l.002-.001.006-.003.018-.008a5.741 5.741 0 00.281-.14c.186-.096.446-.24.757-.433.62-.384 1.445-.966 2.274-1.765C15.302 14.988 17 12.493 17 9A7 7 0 103 9c0 3.492 1.698 5.988 3.355 7.584a13.731 13.731 0 002.273 1.765 11.842 11.842 0 00.976.544l.062.029.018.008.006.003zM10 11.25a2.25 2.25 0 100-4.5 2.25 2.25 0 000 4.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <span>{user.location}</span>
              </div>
            )}
            {user.website && (
              <div className="flex items-center text-blue-500 mr-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                  className="w-5 h-5 mr-1"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.25 5.5a.75.75 0 00-.75.75v8.5c0 .414.336.75.75.75h8.5a.75.75 0 00.75-.75v-4a.75.75 0 011.5 0v4A2.25 2.25 0 0112.75 17h-8.5A2.25 2.25 0 012 14.75v-8.5A2.25 2.25 0 014.25 4h5a.75.75 0 010 1.5h-5z"
                    clipRule="evenodd"
                  />
                  <path
                    fillRule="evenodd"
                    d="M6.194 12.753a.75.75 0 001.06.053L16.5 4.44v2.81a.75.75 0 001.5 0v-4.5a.75.75 0 00-.75-.75h-4.5a.75.75 0 000 1.5h2.553l-9.056 8.194a.75.75 0 00-.053 1.06z"
                    clipRule="evenodd"
                  />
                </svg>
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {user.website.replace(/(^\w+:|^)\/\//, "")}
                </a>
              </div>
            )}
            <div className="flex items-center text-gray-500 dark:text-gray-400">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-5 h-5 mr-1"
              >
                <path
                  fillRule="evenodd"
                  d="M5.75 2a.75.75 0 01.75.75V4h7V2.75a.75.75 0 011.5 0V4h.25A2.75 2.75 0 0118 6.75v8.5A2.75 2.75 0 0115.25 18H4.75A2.75 2.75 0 012 15.25v-8.5A2.75 2.75 0 014.75 4H5V2.75A.75.75 0 015.75 2zm-1 5.5c-.69 0-1.25.56-1.25 1.25v6.5c0 .69.56 1.25 1.25 1.25h10.5c.69 0 1.25-.56 1.25-1.25v-6.5c0-.69-.56-1.25-1.25-1.25H4.75z"
                  clipRule="evenodd"
                />
              </svg>
              <span>{user.joinedDate}に登録</span>
            </div>
          </div>

          <div className="mt-3 flex">
            <Link href={`/profile/following`} className="mr-6">
              <span className="font-bold dark:text-white">
                {user.followingCount}
              </span>{" "}
              <span className="text-gray-500 dark:text-gray-400">
                フォロー中
              </span>
            </Link>
            <Link href={`/profile/followers`}>
              <span className="font-bold dark:text-white">
                {user.followersCount}
              </span>{" "}
              <span className="text-gray-500 dark:text-gray-400">
                フォロワー
              </span>
            </Link>
          </div>
        </div>
      </div>

      {/* タブナビゲーション */}
      <div className="flex border-b border-gray-200 dark:border-dark-border">
        <TabButton
          label="ツイート"
          isActive={activeTab === "tweets"}
          onClick={() => setActiveTab("tweets")}
        />
        <TabButton
          label="返信"
          isActive={activeTab === "replies"}
          onClick={() => setActiveTab("replies")}
        />
        <TabButton
          label="メディア"
          isActive={activeTab === "media"}
          onClick={() => setActiveTab("media")}
        />
        <TabButton
          label="いいね"
          isActive={activeTab === "likes"}
          onClick={() => setActiveTab("likes")}
        />
      </div>

      {/* タブコンテンツ */}
      <div>
        {activeTab === "tweets" && <TweetList userId={user.id} />}
        {activeTab === "replies" && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            まだ返信はありません
          </div>
        )}
        {activeTab === "media" && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            まだメディアはありません
          </div>
        )}
        {activeTab === "likes" && (
          <div className="p-8 text-center text-gray-500 dark:text-gray-400">
            まだいいねはありません
          </div>
        )}
      </div>
    </div>
  );
}

// タブボタンコンポーネント
function TabButton({
  label,
  isActive,
  onClick,
}: {
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      className={`flex-1 py-4 text-sm font-medium ${
        isActive
          ? "text-blue-500 border-b-2 border-blue-500"
          : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
      }`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}

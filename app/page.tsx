"use client";

import TweetForm from "./components/TweetForm";
import TweetList from "./components/TweetList";

export default function Home() {
  // TODO: 実際のユーザー認証実装後に、ログインユーザーのIDを使用
  const temporaryUserId = "temp-user-1";

  const handleTweetSuccess = () => {
    // TweetListコンポーネントを再レンダリングするためのロジックを追加予定
    window.location.reload();
  };

  return (
    <div>
      <header className="sticky top-0 z-10 bg-white/80 dark:bg-dark-bg/80 backdrop-blur-sm border-b border-gray-200 dark:border-dark-border transition-colors duration-300">
        <div className="p-4">
          <h1 className="text-xl font-bold dark:text-white">ホーム</h1>
        </div>
      </header>
      <TweetForm userId={temporaryUserId} onSuccess={handleTweetSuccess} />
      <TweetList />
    </div>
  );
}

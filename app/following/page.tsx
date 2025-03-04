"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TweetCard from "../components/TweetCard";
import LoadingSpinner from "../components/LoadingSpinner";

interface User {
  id: string;
  name: string;
  username: string;
}

interface Tweet {
  id: string;
  content: string;
  createdAt: string;
  user: User;
  isLiked: boolean;
  likesCount: number;
}

export default function FollowingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tweets, setTweets] = useState<Tweet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }

    if (status === "authenticated") {
      fetchFollowingTweets();
    }
  }, [status, router]);

  const fetchFollowingTweets = async () => {
    try {
      const response = await fetch("/api/tweets/following");
      if (!response.ok) {
        throw new Error("フォロー中のツイートの取得に失敗しました");
      }
      const data = await response.json();
      setTweets(data);
    } catch (error) {
      console.error("フォロー中のツイートの取得エラー:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (tweetId: string) => {
    try {
      const response = await fetch(`/api/tweets/${tweetId}/like`, {
        method: "POST",
      });

      if (!response.ok) {
        throw new Error("いいねの処理に失敗しました");
      }

      // ツイートのいいね状態を更新
      setTweets((prevTweets) =>
        prevTweets.map((tweet) => {
          if (tweet.id === tweetId) {
            return {
              ...tweet,
              isLiked: !tweet.isLiked,
              likesCount: tweet.isLiked
                ? tweet.likesCount - 1
                : tweet.likesCount + 1,
            };
          }
          return tweet;
        })
      );
    } catch (error) {
      console.error("いいね処理エラー:", error);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">フォロー中のタイムライン</h1>

      {tweets.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-gray-500">
            フォロー中のユーザーのツイートがありません
          </p>
          <p className="mt-2 text-sm text-gray-400">
            他のユーザーをフォローするとここに表示されます
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {tweets.map((tweet) => (
            <TweetCard
              key={tweet.id}
              tweet={tweet}
              onLike={() => handleLike(tweet.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

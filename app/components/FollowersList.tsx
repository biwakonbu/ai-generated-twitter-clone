"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FollowButton from "./FollowButton";

interface User {
  id: string;
  name: string;
  username: string;
}

interface FollowersListProps {
  userId: string;
}

export default function FollowersList({ userId }: FollowersListProps) {
  const [followers, setFollowers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFollowers();
  }, [userId]);

  const fetchFollowers = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${userId}/followers`);

      if (!response.ok) {
        throw new Error("フォロワー情報の取得に失敗しました");
      }

      const data = await response.json();
      setFollowers(data.followers);
    } catch (error) {
      console.error("フォロワーの取得エラー:", error);
      setError(
        "フォロワー情報の取得に失敗しました。後でもう一度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="text-center p-4">読み込み中...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 p-4">{error}</div>;
  }

  if (followers.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">フォロワーがいません</div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {followers.map((follower) => (
        <div
          key={follower.id}
          className="flex items-center justify-between py-4"
        >
          <Link
            href={`/profile/${follower.username}`}
            className="flex items-center"
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3">
              {/* アバター画像があれば表示 */}
            </div>
            <div>
              <p className="font-medium">{follower.name}</p>
              <p className="text-gray-500 text-sm">@{follower.username}</p>
            </div>
          </Link>
          <FollowButton userId={follower.id} />
        </div>
      ))}
    </div>
  );
}

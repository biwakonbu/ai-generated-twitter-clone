"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import FollowButton from "./FollowButton";

interface User {
  id: string;
  name: string;
  username: string;
}

interface FollowingListProps {
  userId: string;
}

export default function FollowingList({ userId }: FollowingListProps) {
  const [following, setFollowing] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFollowing();
  }, [userId]);

  const fetchFollowing = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/users/${userId}/following`);

      if (!response.ok) {
        throw new Error("フォロー中ユーザー情報の取得に失敗しました");
      }

      const data = await response.json();
      setFollowing(data.following);
    } catch (error) {
      console.error("フォロー中ユーザーの取得エラー:", error);
      setError(
        "フォロー中ユーザー情報の取得に失敗しました。後でもう一度お試しください。"
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

  if (following.length === 0) {
    return (
      <div className="text-center text-gray-500 p-4">
        フォロー中のユーザーがいません
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-200">
      {following.map((user) => (
        <div key={user.id} className="flex items-center justify-between py-4">
          <Link
            href={`/profile/${user.username}`}
            className="flex items-center"
          >
            <div className="w-10 h-10 rounded-full bg-gray-300 mr-3">
              {/* アバター画像があれば表示 */}
            </div>
            <div>
              <p className="font-medium">{user.name}</p>
              <p className="text-gray-500 text-sm">@{user.username}</p>
            </div>
          </Link>
          <FollowButton
            userId={user.id}
            initialIsFollowing={true}
            onFollowChange={(isFollowing) => {
              if (!isFollowing) {
                // フォロー解除した場合、リストから削除（UXの改善）
                setFollowing((prev) => prev.filter((f) => f.id !== user.id));
              }
            }}
          />
        </div>
      ))}
    </div>
  );
}

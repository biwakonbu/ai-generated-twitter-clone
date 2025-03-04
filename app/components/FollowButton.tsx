"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

interface FollowButtonProps {
  userId: string;
  initialIsFollowing?: boolean;
  onFollowChange?: (isFollowing: boolean) => void;
}

export default function FollowButton({
  userId,
  initialIsFollowing = false,
  onFollowChange,
}: FollowButtonProps) {
  const { data: session } = useSession();
  const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
  const [isLoading, setIsLoading] = useState(false);

  // 初期のフォロー状態を取得
  useEffect(() => {
    if (session?.user) {
      fetchFollowStatus();
    }
  }, [session, userId]);

  const fetchFollowStatus = async () => {
    try {
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: "GET",
      });
      const data = await response.json();
      setIsFollowing(data.isFollowing);
    } catch (error) {
      console.error("フォロー状態の取得に失敗しました:", error);
    }
  };

  const handleFollowToggle = async () => {
    if (!session?.user) {
      // 非ログイン状態の場合はログインページへリダイレクト
      window.location.href = "/login";
      return;
    }

    setIsLoading(true);
    try {
      const action = isFollowing ? "unfollow" : "follow";
      const response = await fetch(`/api/users/${userId}/follow`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ action }),
      });

      if (response.ok) {
        const newFollowState = !isFollowing;
        setIsFollowing(newFollowState);

        // 親コンポーネントに状態変更を通知
        if (onFollowChange) {
          onFollowChange(newFollowState);
        }
      } else {
        const errorData = await response.json();
        console.error("フォロー操作に失敗しました:", errorData.error);
      }
    } catch (error) {
      console.error("フォロー操作に失敗しました:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 自分自身のプロフィールには表示しない
  if (session?.user?.email && session.user.email === userId) {
    return null;
  }

  return (
    <button
      onClick={handleFollowToggle}
      disabled={isLoading}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-colors 
        ${
          isFollowing
            ? "bg-white text-black border border-gray-300 hover:bg-gray-100"
            : "bg-black text-white hover:bg-gray-800"
        } disabled:opacity-50`}
    >
      {isLoading ? "処理中..." : isFollowing ? "フォロー中" : "フォローする"}
    </button>
  );
}

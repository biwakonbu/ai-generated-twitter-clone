"use client";

import { signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      // callbackUrlを指定せず、デフォルトの動作に任せる
      await signOut({ redirect: false });
      // 手動でルートページに遷移させる
      router.push("/");
    } catch (error) {
      console.error("ログアウト中にエラーが発生しました:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:opacity-50"
    >
      {loading ? "ログアウト中..." : "ログアウト"}
    </button>
  );
}

"use client";

import { useState, useEffect } from "react";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

export default function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 初期化時にローカルストレージまたはシステム設定からテーマを取得
  useEffect(() => {
    try {
      if (
        localStorage.theme === "dark" ||
        (!("theme" in localStorage) &&
          window.matchMedia("(prefers-color-scheme: dark)").matches)
      ) {
        setIsDarkMode(true);
        document.documentElement.classList.add("dark");
      } else {
        setIsDarkMode(false);
        document.documentElement.classList.remove("dark");
      }
    } catch (error) {
      console.error("テーマ初期化エラー:", error);
      // エラー時はデフォルトでライトモードに
      setIsDarkMode(false);
    }
  }, []);

  // テーマ切り替え
  const toggleTheme = () => {
    try {
      if (isDarkMode) {
        document.documentElement.classList.remove("dark");
        localStorage.theme = "light";
        setIsDarkMode(false);
      } else {
        document.documentElement.classList.add("dark");
        localStorage.theme = "dark";
        setIsDarkMode(true);
      }
    } catch (error) {
      console.error("テーマ切り替えエラー:", error);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors duration-300"
      aria-label={
        isDarkMode ? "ライトモードに切り替え" : "ダークモードに切り替え"
      }
      title={isDarkMode ? "ライトモードに切り替え" : "ダークモードに切り替え"}
    >
      {isDarkMode ? (
        <SunIcon className="h-6 w-6 text-yellow-500" />
      ) : (
        <MoonIcon className="h-6 w-6 text-gray-700" />
      )}
    </button>
  );
}

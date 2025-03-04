"use client";

import { useState, useRef, useEffect } from "react";
import {
  PhotoIcon,
  FaceSmileIcon,
  CalendarIcon,
  MapPinIcon,
  ChartBarIcon,
  GifIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

interface TweetFormProps {
  userId: string;
  onSuccess?: () => void;
}

// 最大ツイート文字数
const MAX_TWEET_LENGTH = 280;

export default function TweetForm({ userId, onSuccess }: TweetFormProps) {
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // テキストエリアの高さを自動調整
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [content]);

  // 成功後のアニメーション
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;

    setError("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/tweets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          userId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "ツイートの投稿に失敗しました");
      }

      setContent("");
      setSuccess(true);
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "エラーが発生しました");
    } finally {
      setIsLoading(false);
    }
  };

  // 残り文字数の計算
  const remainingChars = MAX_TWEET_LENGTH - content.length;
  const isOverLimit = remainingChars < 0;

  // プログレスリング用の計算
  const percentage = (content.length / MAX_TWEET_LENGTH) * 100;
  const isWarning = percentage >= 80 && percentage < 100;
  const isDanger = percentage >= 100;

  return (
    <div className="border-b border-gray-200 dark:border-dark-border p-4 bg-white dark:bg-dark-bg transition-colors">
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 p-3 rounded-lg mb-4 flex justify-between items-center">
          <p>{error}</p>
          <button onClick={() => setError("")} className="text-red-500">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {success && (
        <div className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 p-3 rounded-lg mb-4 flex justify-between items-center">
          <p>ツイートが投稿されました！</p>
          <button onClick={() => setSuccess(false)} className="text-green-500">
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex flex-col">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            <div className="h-12 w-12 rounded-full bg-gray-300 dark:bg-gray-700 overflow-hidden">
              {/* アイコン画像がある場合は表示、ない場合はデフォルトアイコン */}
              <div className="flex items-center justify-center h-full text-gray-700 dark:text-gray-300">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => !content && setIsFocused(false)}
              placeholder="いまどうしてる？"
              className="w-full text-lg bg-transparent dark:text-white border-none focus:ring-0 resize-none overflow-hidden outline-none min-h-[60px]"
              rows={1}
              maxLength={MAX_TWEET_LENGTH * 2} // ハードリミットは2倍に
            />

            {/* isFocused または content があるときのみ表示 */}
            {(isFocused || content) && (
              <div className="mt-2 flex flex-col sm:flex-row sm:items-center sm:justify-between border-t border-gray-200 dark:border-dark-border pt-3">
                <div className="flex space-x-2 text-twitter-blue mb-3 sm:mb-0">
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-dark-hover transition-colors"
                    title="画像を追加"
                  >
                    <PhotoIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-dark-hover transition-colors"
                    title="GIFを追加"
                  >
                    <GifIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-dark-hover transition-colors"
                    title="投票を作成"
                  >
                    <ChartBarIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-dark-hover transition-colors"
                    title="絵文字を追加"
                  >
                    <FaceSmileIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-dark-hover transition-colors"
                    title="スケジュール"
                  >
                    <CalendarIcon className="h-5 w-5" />
                  </button>
                  <button
                    type="button"
                    className="p-2 rounded-full hover:bg-blue-50 dark:hover:bg-dark-hover transition-colors"
                    title="位置情報を追加"
                  >
                    <MapPinIcon className="h-5 w-5" />
                  </button>
                </div>
                <div className="flex items-center space-x-3">
                  {/* プログレスリング */}
                  {content.length > 0 && (
                    <div className="relative h-7 w-7">
                      <svg className="h-full w-full" viewBox="0 0 24 24">
                        <circle
                          className="text-gray-200 dark:text-gray-700"
                          strokeWidth="2"
                          stroke="currentColor"
                          fill="transparent"
                          r="10"
                          cx="12"
                          cy="12"
                        />
                        <circle
                          className={`${
                            isDanger
                              ? "text-red-500"
                              : isWarning
                              ? "text-yellow-500"
                              : "text-twitter-blue"
                          }`}
                          strokeWidth="2"
                          strokeDasharray={`${
                            percentage >= 100 ? 100 : percentage
                          } 100`}
                          strokeLinecap="round"
                          stroke="currentColor"
                          fill="transparent"
                          r="10"
                          cx="12"
                          cy="12"
                          style={{
                            transformOrigin: "center",
                            transform: "rotate(-90deg)",
                          }}
                        />
                      </svg>
                      {isWarning || isDanger ? (
                        <span
                          className={`absolute inset-0 flex items-center justify-center text-xs ${
                            isDanger
                              ? "text-red-500"
                              : isWarning
                              ? "text-yellow-500"
                              : ""
                          }`}
                        >
                          {remainingChars}
                        </span>
                      ) : null}
                    </div>
                  )}

                  {/* 区切り線 */}
                  {content.length > 0 && (
                    <div className="h-6 w-px bg-gray-300 dark:bg-gray-700"></div>
                  )}

                  {/* ツイートボタン */}
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-full font-bold text-white ${
                      !content.trim() || isLoading || isOverLimit
                        ? "bg-twitter-blue opacity-50 cursor-not-allowed"
                        : "bg-twitter-blue hover:bg-twitter-blue-hover transition-colors"
                    }`}
                    disabled={!content.trim() || isLoading || isOverLimit}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                        投稿中...
                      </div>
                    ) : (
                      "ツイートする"
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}

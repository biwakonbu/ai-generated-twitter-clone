"use client";

import { useState } from "react";
import { Dialog } from "@headlessui/react";
import { XMarkIcon } from "@heroicons/react/24/outline";

interface TweetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTweet: (content: string) => Promise<void>;
}

const TweetModal = ({ isOpen, onClose, onTweet }: TweetModalProps) => {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      await onTweet(content);
      setContent("");
      onClose();
    } catch (error) {
      console.error("ツイート投稿エラー:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      className="fixed inset-0 z-50 overflow-y-auto"
    >
      <div className="flex min-h-screen items-center justify-center">
        <div className="fixed inset-0 bg-black opacity-40" />

        <div className="relative bg-white dark:bg-dark-bg rounded-xl w-full max-w-lg mx-4 p-4">
          <button
            onClick={onClose}
            className="absolute top-4 left-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-dark-hover transition-colors"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-dark-text" />
          </button>

          <div className="mt-8">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="いまどうしてる？"
              className="w-full h-32 p-4 text-lg border-none focus:ring-0 bg-transparent dark:text-dark-text resize-none"
              maxLength={280}
            />

            <div className="flex items-center justify-between mt-4 border-t dark:border-dark-border pt-4">
              <div className="text-sm text-gray-500 dark:text-dark-text-secondary">
                {content.length}/280
              </div>
              <button
                onClick={handleSubmit}
                disabled={!content.trim() || isSubmitting}
                className={`px-6 py-2 rounded-full font-bold text-white transition-colors ${
                  content.trim() && !isSubmitting
                    ? "bg-twitter-blue hover:bg-twitter-blue-hover"
                    : "bg-twitter-blue/50 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "投稿中..." : "ツイートする"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default TweetModal;

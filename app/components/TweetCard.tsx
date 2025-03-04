import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

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

interface TweetCardProps {
  tweet: Tweet;
  onLike: () => void;
}

export default function TweetCard({ tweet, onLike }: TweetCardProps) {
  const [isLikeAnimating, setIsLikeAnimating] = useState(false);

  const formattedDate = formatDistanceToNow(new Date(tweet.createdAt), {
    addSuffix: true,
    locale: ja,
  });

  // いいねの強調表示（10以上でハイライト）
  const isPopular = tweet.likesCount >= 10;

  const handleLikeClick = () => {
    setIsLikeAnimating(true);
    onLike();
  };

  return (
    <div
      className={`bg-white dark:bg-gray-800 p-4 rounded-lg shadow transition-all duration-300 ${
        isPopular ? "border-2 border-yellow-400 dark:border-yellow-500" : ""
      }`}
    >
      {isPopular && (
        <div className="mb-2 text-xs font-medium bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 py-1 px-2 rounded inline-block">
          <span>🔥 人気のツイート</span>
        </div>
      )}

      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center">
            <span className="text-gray-600">{tweet.user.name.charAt(0)}</span>
          </div>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-1">
            <Link
              href={`/users/${tweet.user.id}`}
              className="font-medium text-gray-900 dark:text-white hover:underline"
            >
              {tweet.user.name}
            </Link>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              @{tweet.user.username}
            </span>
            <span className="text-sm text-gray-500 dark:text-gray-400">·</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {formattedDate}
            </span>
          </div>

          <p className="mt-1 text-gray-900 dark:text-white whitespace-pre-wrap break-words">
            {tweet.content}
          </p>

          <div className="mt-2 flex items-center">
            <button
              onClick={handleLikeClick}
              className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500 transition"
              disabled={isLikeAnimating}
            >
              <AnimatePresence mode="wait">
                {tweet.isLiked ? (
                  <motion.div
                    key="liked"
                    initial={{ scale: 1 }}
                    animate={{ scale: isLikeAnimating ? [1, 1.5, 1] : 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                    onAnimationComplete={() => setIsLikeAnimating(false)}
                  >
                    <FaHeart className="text-red-500" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="notLiked"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <FaRegHeart />
                  </motion.div>
                )}
              </AnimatePresence>
              <motion.span
                animate={{
                  scale: isLikeAnimating ? [1, 1.2, 1] : 1,
                }}
                transition={{ duration: 0.3 }}
              >
                {tweet.likesCount}
              </motion.span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

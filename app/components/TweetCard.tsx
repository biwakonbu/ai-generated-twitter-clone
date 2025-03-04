import { formatDistanceToNow } from "date-fns";
import { ja } from "date-fns/locale";
import Link from "next/link";
import { FaHeart, FaRegHeart } from "react-icons/fa";

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
  const formattedDate = formatDistanceToNow(new Date(tweet.createdAt), {
    addSuffix: true,
    locale: ja,
  });

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
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
              onClick={onLike}
              className="flex items-center space-x-1 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-500 transition"
            >
              {tweet.isLiked ? (
                <FaHeart className="text-red-500" />
              ) : (
                <FaRegHeart />
              )}
              <span>{tweet.likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

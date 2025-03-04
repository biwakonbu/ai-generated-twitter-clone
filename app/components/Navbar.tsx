"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path: string) => {
    return pathname === path;
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    setIsMenuOpen(false);
    router.push("/");
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 justify-between">
          <div className="flex">
            <div className="flex flex-shrink-0 items-center">
              <Link href="/" className="text-xl font-bold text-blue-600">
                ツイッタークローン
              </Link>
            </div>
            <div className="ml-6 hidden sm:flex sm:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                  isActive("/")
                    ? "border-blue-500 text-gray-900"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                }`}
              >
                ホーム
              </Link>
              {session && (
                <Link
                  href="/profile"
                  className={`inline-flex items-center border-b-2 px-1 pt-1 text-sm font-medium ${
                    isActive("/profile")
                      ? "border-blue-500 text-gray-900"
                      : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
                  }`}
                >
                  プロフィール
                </Link>
              )}
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {status === "loading" ? (
              <div className="h-8 w-8 animate-pulse rounded-full bg-gray-200"></div>
            ) : session ? (
              <div className="relative ml-3">
                <div>
                  <button
                    type="button"
                    className="flex rounded-full bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    onClick={toggleMenu}
                  >
                    <span className="sr-only">メニューを開く</span>
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                      {session.user?.name?.charAt(0).toUpperCase() || "U"}
                    </div>
                  </button>
                </div>
                {isMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 origin-top-right rounded-md bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="block border-b border-gray-100 px-4 py-2 text-sm text-gray-700">
                      <p className="font-medium">{session.user?.name}</p>
                      <p className="text-gray-500">
                        @{session.user?.username || "user"}
                      </p>
                    </div>
                    <Link
                      href="/profile"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      プロフィール
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-100"
                    >
                      ログアウト
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  href="/login"
                  className="rounded-md bg-white px-3 py-2 text-sm font-medium text-blue-600 hover:bg-gray-50"
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  className="rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  登録
                </Link>
              </div>
            )}
          </div>
          <div className="-mr-2 flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              onClick={toggleMenu}
            >
              <span className="sr-only">メニューを開く</span>
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                {isMenuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      {isMenuOpen && (
        <div className="sm:hidden">
          <div className="space-y-1 pt-2 pb-3">
            <Link
              href="/"
              className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                isActive("/")
                  ? "border-blue-500 bg-blue-50 text-blue-700"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
              }`}
              onClick={() => setIsMenuOpen(false)}
            >
              ホーム
            </Link>
            {session && (
              <Link
                href="/profile"
                className={`block border-l-4 py-2 pl-3 pr-4 text-base font-medium ${
                  isActive("/profile")
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                }`}
                onClick={() => setIsMenuOpen(false)}
              >
                プロフィール
              </Link>
            )}
          </div>
          {session ? (
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
                    {session.user?.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">
                    {session.user?.name}
                  </div>
                  <div className="text-sm font-medium text-gray-500">
                    @{session.user?.username || "user"}
                  </div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <button
                  onClick={handleLogout}
                  className="block w-full px-4 py-2 text-left text-base font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-800"
                >
                  ログアウト
                </button>
              </div>
            </div>
          ) : (
            <div className="border-t border-gray-200 pt-4 pb-3">
              <div className="flex flex-col space-y-2 px-4">
                <Link
                  href="/login"
                  className="w-full rounded-md bg-white px-4 py-2 text-center text-base font-medium text-blue-600 hover:bg-gray-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ログイン
                </Link>
                <Link
                  href="/register"
                  className="w-full rounded-md bg-blue-600 px-4 py-2 text-center text-base font-medium text-white hover:bg-blue-700"
                  onClick={() => setIsMenuOpen(false)}
                >
                  登録
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

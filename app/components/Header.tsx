"use client";

import Link from "next/link";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 bg-white border-b">
      <div className="flex justify-between items-center px-4 py-3 max-w-6xl mx-auto">
        <Link href="/" className="text-xl font-bold">
          TwitterClone
        </Link>
        <nav className="flex space-x-4">
          <Link href="/" className="hover:text-blue-500">
            ホーム
          </Link>
          <Link href="/profile" className="hover:text-blue-500">
            プロフィール
          </Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;

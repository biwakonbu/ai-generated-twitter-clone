"use client";

import { SessionProvider as NextAuthSessionProvider } from "next-auth/react";
import { useEffect } from "react";

export default function SessionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    console.log("SessionProvider マウント");
  }, []);

  return (
    <NextAuthSessionProvider
      refetchInterval={60} // 60秒ごとにセッションをリフレッシュ
      refetchOnWindowFocus={true}
    >
      {children}
    </NextAuthSessionProvider>
  );
}

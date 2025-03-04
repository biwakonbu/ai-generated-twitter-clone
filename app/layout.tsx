import { Inter } from "next/font/google";
import "./globals.css";
import type { Metadata } from "next";
import SessionProvider from "./SessionProvider";
import ClientLayout from "./ClientLayout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Twitter Clone",
  description: "Next.jsで作成したTwitterクローン",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {
                console.error('Theme initialization failed:', e);
              }
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        <SessionProvider>
          <ClientLayout>{children}</ClientLayout>
        </SessionProvider>
      </body>
    </html>
  );
}

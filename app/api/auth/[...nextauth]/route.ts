import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { serverStorage } from "../../../lib/serverStorage";
import bcrypt from "bcryptjs";
import { JWT } from "next-auth/jwt";
import { Session } from "next-auth";

// データベースの初期化を試みる
try {
  serverStorage.initDatabase();
  console.log("データベースが正常に初期化されました");
} catch (error) {
  console.error("データベース初期化エラー:", error);
}

// NextAuthの型定義を拡張
declare module "next-auth" {
  interface User {
    id: string;
    name: string;
    email: string;
    username: string;
  }

  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      username: string;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    username: string;
  }
}

// NextAuth.js の設定
export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.log("認証情報が不足しています");
            return null;
          }

          const user = await serverStorage.findUserByEmail(credentials.email);

          if (!user) {
            console.log(
              `メールアドレス ${credentials.email} のユーザーが見つかりません`
            );
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            console.log("パスワードが一致しません");
            return null;
          }

          console.log(`ユーザー ${user.username} が正常にログインしました`);

          return {
            id: user.id,
            name: user.name,
            email: user.email,
            username: user.username,
          };
        } catch (error) {
          console.error("認証エラー:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30日
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET || "your-fallback-secret-key",
};

// NextAuth ハンドラーの作成
const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

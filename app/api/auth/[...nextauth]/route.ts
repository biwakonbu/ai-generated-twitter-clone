import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { sqliteStorage } from "../../../lib/sqliteStorage";
import bcrypt from "bcrypt";
import { JWT } from "next-auth/jwt";

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

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "ログイン情報",
      credentials: {
        email: {
          label: "メールアドレス",
          type: "email",
          placeholder: "メールアドレスを入力",
        },
        password: {
          label: "パスワード",
          type: "password",
          placeholder: "パスワードを入力",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        // メールアドレスでユーザーを検索
        const user = await sqliteStorage.findUserByEmail(credentials.email);

        if (!user) {
          console.log("ユーザーが見つかりません:", credentials.email);
          return null;
        }

        // パスワードの検証
        const isValidPassword = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isValidPassword) {
          console.log("パスワードが一致しません:", credentials.email);
          return null;
        }

        // 認証成功時はユーザー情報を返す（パスワードは除外）
        return {
          id: user.id,
          name: user.name,
          email: user.email,
          username: user.username,
        };
      },
    }),
  ],
  pages: {
    signIn: "/login",
    signOut: "/",
    error: "/login",
  },
  session: {
    strategy: "jwt" as const,
    maxAge: 30 * 24 * 60 * 60, // 30日間
  },
  callbacks: {
    async jwt({ token, user }: { token: JWT; user: any }) {
      // 初回ログイン時にユーザー情報をトークンに追加
      if (user) {
        token.id = user.id;
        token.username = user.username;
      }
      return token;
    },
    async session({ session, token }: { session: any; token: JWT }) {
      // セッションにユーザー情報を追加
      if (token && session.user) {
        session.user.id = token.id;
        session.user.username = token.username;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };

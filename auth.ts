import NextAuth from "next-auth";
import { authOptions } from "./app/api/auth/[...nextauth]/route";

// セッションを取得するためのヘルパー関数
export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);

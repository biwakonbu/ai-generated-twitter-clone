import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { serverStorage } from "../../../lib/serverStorage";

const prisma = new PrismaClient();

// フォローしているユーザーのツイートを取得するAPI
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 仮のレスポンスを返す（モックデータ）
    // 本来はserverStorageを使って本物のデータを取得すべきですが、
    // フォロー機能が実装されていないため、暫定的に空の配列を返します
    return NextResponse.json([]);
  } catch (error) {
    console.error("フォローユーザーのツイート取得に失敗しました:", error);
    return NextResponse.json(
      { error: "フォローユーザーのツイート取得に失敗しました" },
      { status: 500 }
    );
  }
}

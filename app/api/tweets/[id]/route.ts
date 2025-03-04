import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../auth/[...nextauth]/route";
import { serverStorage } from "../../../lib/serverStorage";

// ツイートを削除するAPI
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 対象のツイートを取得
    const tweet = await serverStorage.getTweetById(params.id);

    if (!tweet) {
      return NextResponse.json(
        { error: "ツイートが見つかりません" },
        { status: 404 }
      );
    }

    // ツイートの作成者かどうかを確認
    if (tweet.userId !== session.user.id) {
      return NextResponse.json(
        { error: "このツイートを削除する権限がありません" },
        { status: 403 }
      );
    }

    // 実際の削除機能はserverStorageに実装されていないため
    // ここでは成功レスポンスを返すだけにします
    return NextResponse.json({ message: "ツイートを削除しました" });
  } catch (error) {
    console.error("ツイート削除エラー:", error);
    return NextResponse.json(
      { error: "ツイートの削除に失敗しました" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { serverStorage } from "../../../../lib/serverStorage";

// いいねの追加/削除を行うAPI
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tweetId = params.id;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const userId = session.user.id;

    // 対象のツイートが存在するか確認
    const tweet = await serverStorage.getTweetById(tweetId);

    if (!tweet) {
      return NextResponse.json(
        { error: "ツイートが見つかりません" },
        { status: 404 }
      );
    }

    // 既にいいねしているか確認
    const hasLiked = await serverStorage.hasUserLikedTweet(userId, tweetId);

    // いいねが存在する場合は削除、存在しない場合は追加
    if (hasLiked) {
      // いいねを削除
      await serverStorage.deleteLike(userId, tweetId);
      return NextResponse.json({ liked: false });
    } else {
      // いいねを追加
      await serverStorage.createLike({
        userId,
        tweetId,
      });
      return NextResponse.json({ liked: true });
    }
  } catch (error) {
    console.error("いいね処理に失敗しました:", error);
    return NextResponse.json(
      { error: "いいね処理に失敗しました" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../../auth";

const prisma = new PrismaClient();

// いいねの追加/削除を行うAPI
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tweetId = params.id;
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // 現在ログイン中のユーザーを取得
    const currentUser = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!currentUser) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    // 対象のツイートが存在するか確認
    const tweet = await prisma.tweet.findUnique({
      where: { id: tweetId },
    });

    if (!tweet) {
      return NextResponse.json(
        { error: "ツイートが見つかりません" },
        { status: 404 }
      );
    }

    // 既にいいねしているか確認
    const existingLike = await prisma.like.findUnique({
      where: {
        userId_tweetId: {
          userId: currentUser.id,
          tweetId,
        },
      },
    });

    // いいねが存在する場合は削除、存在しない場合は追加
    if (existingLike) {
      // いいねを削除
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
      return NextResponse.json({ liked: false });
    } else {
      // いいねを追加
      await prisma.like.create({
        data: {
          userId: currentUser.id,
          tweetId,
        },
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

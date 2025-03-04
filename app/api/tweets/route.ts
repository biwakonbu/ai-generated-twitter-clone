import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../auth";

const prisma = new PrismaClient();

// ツイートを投稿するAPI
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    // リクエストボディを取得
    const { content } = await request.json();

    if (!content || typeof content !== "string" || content.length > 280) {
      return NextResponse.json(
        { error: "不正なツイート内容です" },
        { status: 400 }
      );
    }

    // 現在ログイン中のユーザーを取得
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    // ツイートを作成
    const tweet = await prisma.tweet.create({
      data: {
        content,
        userId: user.id,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            username: true,
          },
        },
      },
    });

    return NextResponse.json(tweet, { status: 201 });
  } catch (error) {
    console.error("ツイート投稿エラー:", error);
    return NextResponse.json(
      { error: "ツイートの投稿に失敗しました" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    // URLからクエリパラメータを取得
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    // 仮のログインユーザーID（認証機能実装後に修正）
    const currentUserId = "user123";

    // ユーザーIDが指定されている場合はそのユーザーのツイートのみを取得
    const tweets = userId
      ? await prisma.tweet.findMany({
          where: {
            userId: userId,
          },
          include: {
            user: true,
          },
        })
      : await prisma.tweet.findMany({
          include: {
            user: true,
          },
        });

    // いいね情報を追加したツイートリストを作成
    const tweetsWithLikes = await Promise.all(
      tweets.map(async (tweet) => {
        // ツイートのいいね数を取得
        const likes = await prisma.like.findMany({
          where: {
            tweetId: tweet.id,
          },
        });

        // 現在のユーザーがいいねしているかどうかを確認
        const isLiked = await prisma.like.findFirst({
          where: {
            tweetId: tweet.id,
            userId: currentUserId,
          },
        });

        return {
          ...tweet,
          likes: likes.length,
          isLiked: !!isLiked,
        };
      })
    );

    return NextResponse.json(tweetsWithLikes);
  } catch (error) {
    console.error("ツイート取得エラー:", error);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

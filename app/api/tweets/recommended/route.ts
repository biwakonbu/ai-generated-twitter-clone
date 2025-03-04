import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../auth";

const prisma = new PrismaClient();

// おすすめツイートを取得するAPI
export async function GET(request: NextRequest) {
  try {
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

    // いいねの多い順にツイートを取得（過去7日間）
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

    // 全てのツイートを取得（過去7日間）
    const tweets = await prisma.tweet.findMany({
      where: {
        createdAt: {
          gte: oneWeekAgo,
        },
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
      orderBy: {
        createdAt: "desc",
      },
    });

    // 各ツイートのいいね数を取得し、いいね数でソート
    const tweetsWithLikes = await Promise.all(
      tweets.map(async (tweet) => {
        const likesCount = await prisma.like.count({
          where: { tweetId: tweet.id },
        });

        const isLiked = await prisma.like.findUnique({
          where: {
            userId_tweetId: {
              userId: currentUser.id,
              tweetId: tweet.id,
            },
          },
        });

        return {
          id: tweet.id,
          content: tweet.content,
          createdAt: tweet.createdAt,
          user: tweet.user,
          isLiked: !!isLiked,
          likesCount,
        };
      })
    );

    // いいね数でソート（多い順）
    const sortedTweets = tweetsWithLikes.sort(
      (a, b) => b.likesCount - a.likesCount
    );

    // 上位50件を返す
    return NextResponse.json(sortedTweets.slice(0, 50));
  } catch (error) {
    console.error("おすすめツイート取得に失敗しました:", error);
    return NextResponse.json(
      { error: "おすすめツイート取得に失敗しました" },
      { status: 500 }
    );
  }
}

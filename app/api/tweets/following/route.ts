import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { auth } from "../../../../auth";

const prisma = new PrismaClient();

// フォローしているユーザーのツイートを取得するAPI
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

    // フォローしているユーザーのIDを取得
    const followings = await prisma.follow.findMany({
      where: { followerId: currentUser.id },
      select: {
        followingId: true,
      },
    });

    const followingIds = followings.map((follow) => follow.followingId);

    // 自分自身のIDも追加（自分のツイートも表示する）
    followingIds.push(currentUser.id);

    // フォローしているユーザーと自分自身のツイートを取得
    const tweets = await prisma.tweet.findMany({
      where: {
        userId: {
          in: followingIds,
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

    // ユーザーがいいねしたツイートIDを取得
    const likedTweets = await prisma.like.findMany({
      where: {
        userId: currentUser.id,
        tweetId: {
          in: tweets.map((tweet) => tweet.id),
        },
      },
      select: {
        tweetId: true,
      },
    });

    const likedTweetIds = new Set(likedTweets.map((like) => like.tweetId));

    // 各ツイートのいいね数を取得
    const tweetsWithLikesCount = await Promise.all(
      tweets.map(async (tweet) => {
        const likesCount = await prisma.like.count({
          where: { tweetId: tweet.id },
        });

        return {
          id: tweet.id,
          content: tweet.content,
          createdAt: tweet.createdAt,
          user: tweet.user,
          isLiked: likedTweetIds.has(tweet.id),
          likesCount,
        };
      })
    );

    return NextResponse.json(tweetsWithLikesCount);
  } catch (error) {
    console.error("フォローユーザーのツイート取得に失敗しました:", error);
    return NextResponse.json(
      { error: "フォローユーザーのツイート取得に失敗しました" },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import { serverStorage } from "../../lib/serverStorage";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/route";

// ツイートを投稿するAPI
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
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

    // ツイートを作成
    const tweet = await serverStorage.createTweet({
      content,
      userId: session.user.id,
    });

    const user = await serverStorage.findUserById(session.user.id);

    const response = {
      ...tweet,
      user: {
        id: user?.id,
        name: user?.name,
        username: user?.username,
      },
    };

    return NextResponse.json(response, { status: 201 });
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

    // セッションからユーザー情報を取得（ログインしていなければnull）
    const session = await getServerSession(authOptions);
    const currentUserId = session?.user?.id || null;

    // ユーザーIDが指定されている場合はそのユーザーのツイートのみを取得
    const tweets = userId
      ? await serverStorage.getTweetsByUserId(userId)
      : await serverStorage.getTweets();

    // いいね情報を追加したツイートリストを作成
    const tweetsWithLikes = await Promise.all(
      tweets.map(async (tweet) => {
        // ツイートのいいね数を取得
        const likes = await serverStorage.getLikesByTweetId(tweet.id);

        // 現在のユーザーがいいねしているかどうかを確認
        const isLiked = currentUserId
          ? await serverStorage.hasUserLikedTweet(currentUserId, tweet.id)
          : false;

        // ツイート投稿者の情報を取得
        const user = await serverStorage.findUserById(tweet.userId);

        return {
          ...tweet,
          likes: likes.length,
          isLiked: isLiked,
          user: {
            id: user?.id,
            name: user?.name,
            username: user?.username,
          },
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

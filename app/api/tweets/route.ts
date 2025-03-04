import { NextResponse } from "next/server";
import { storage } from "../../lib/storage";

export async function POST(request: Request) {
  try {
    const { content, userId } = await request.json();

    // バリデーション
    if (!content || !userId) {
      return NextResponse.json(
        { message: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    // ツイートの作成
    const tweet = await storage.createTweet({
      content,
      userId,
    });

    return NextResponse.json(tweet, { status: 201 });
  } catch (error) {
    console.error("ツイート作成エラー:", error);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました" },
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
      ? await storage.getTweetsByUserId(userId)
      : await storage.getTweets();

    // いいね情報を追加したツイートリストを作成
    const tweetsWithLikes = await Promise.all(
      tweets.map(async (tweet) => {
        // ツイートのいいね数を取得
        const likes = await storage.getLikesByTweetId(tweet.id);

        // 現在のユーザーがいいねしているかどうかを確認
        const isLiked = await storage.hasUserLikedTweet(
          currentUserId,
          tweet.id
        );

        return {
          ...tweet,
          likes: likes.length,
          isLiked,
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

import { NextRequest, NextResponse } from "next/server";
import { sqliteStorage } from "../../../../lib/sqliteStorage";

// POSTリクエストでいいねを作成
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tweetId = params.id;

    // 仮のユーザーID（認証機能実装後に修正）
    const userId = "user123";

    console.log(`[いいね作成] ユーザーID: ${userId}, ツイートID: ${tweetId}`);

    // ツイートが存在するか確認
    const tweet = await sqliteStorage.getTweetById(tweetId);
    if (!tweet) {
      console.log(`[いいね作成エラー] ツイートが見つかりません: ${tweetId}`);
      return NextResponse.json(
        { message: "ツイートが見つかりません" },
        { status: 404 }
      );
    }

    // ユーザーが既にいいねしているか確認
    const hasLiked = await sqliteStorage.hasUserLikedTweet(userId, tweetId);
    if (hasLiked) {
      console.log(
        `[いいね作成スキップ] ユーザーは既にいいねしています: ${userId}, ツイート: ${tweetId}`
      );
      return NextResponse.json(
        { message: "既にいいねしています" },
        { status: 200 }
      );
    }

    // いいねを追加
    const like = await sqliteStorage.createLike(userId, tweetId);
    console.log(
      `[いいね作成成功] ID: ${like.id}, ユーザー: ${userId}, ツイート: ${tweetId}`
    );

    return NextResponse.json(like, { status: 201 });
  } catch (error) {
    console.error("いいね作成エラー:", error);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

// DELETEリクエストでいいねを削除
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const tweetId = params.id;

    // 仮のユーザーID（認証機能実装後に修正）
    const userId = "user123";

    console.log(`[いいね削除] ユーザーID: ${userId}, ツイートID: ${tweetId}`);

    // ツイートが存在するか確認
    const tweet = await sqliteStorage.getTweetById(tweetId);
    if (!tweet) {
      console.log(`[いいね削除エラー] ツイートが見つかりません: ${tweetId}`);
      return NextResponse.json(
        { message: "ツイートが見つかりません" },
        { status: 404 }
      );
    }

    // ユーザーがいいねしているか確認
    const hasLiked = await sqliteStorage.hasUserLikedTweet(userId, tweetId);
    if (!hasLiked) {
      console.log(
        `[いいね削除スキップ] ユーザーはいいねしていません: ${userId}, ツイート: ${tweetId}`
      );
      return NextResponse.json(
        { message: "いいねしていません" },
        { status: 200 }
      );
    }

    // いいねを削除
    await sqliteStorage.deleteLike(userId, tweetId);
    console.log(`[いいね削除成功] ユーザー: ${userId}, ツイート: ${tweetId}`);

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("いいね削除エラー:", error);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

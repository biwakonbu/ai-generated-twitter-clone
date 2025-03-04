import { NextResponse } from "next/server";
import { serverStorage } from "../../lib/serverStorage";

export async function GET(request: Request) {
  try {
    // データベースの初期化
    await serverStorage.initDatabase();

    // ユーザー一覧の取得
    const users = await Promise.all(
      (
        await serverStorage.getTweets()
      ).map(async (tweet) => {
        const user = await serverStorage.findUserById(tweet.userId);
        return {
          ...tweet,
          user: user
            ? {
                id: user.id,
                username: user.username,
                name: user.name,
              }
            : null,
        };
      })
    );

    return NextResponse.json({
      success: true,
      message: "テストAPIが正常に動作しています",
      users,
    });
  } catch (error) {
    console.error("テストAPIエラー:", error);
    return NextResponse.json(
      {
        success: false,
        error: "テストAPI実行中にエラーが発生しました",
        message: error instanceof Error ? error.message : "不明なエラー",
      },
      { status: 500 }
    );
  }
}

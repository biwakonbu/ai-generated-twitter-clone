import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ユーザーがフォローしているユーザー一覧を取得するAPI
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // ユーザーが存在するか確認
    const user = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    // フォロー中のユーザー一覧を取得
    const following = await prisma.follow.findMany({
      where: { followerId: params.id },
      include: {
        following: {
          select: {
            id: true,
            username: true,
            name: true,
            // パスワードなどの機密情報は除外
          },
        },
      },
    });

    // フォロー中のユーザー情報のみを抽出
    const formattedFollowing = following.map((follow) => follow.following);

    return NextResponse.json({ following: formattedFollowing });
  } catch (error) {
    console.error("フォロー中ユーザー一覧の取得に失敗しました:", error);
    return NextResponse.json(
      { error: "フォロー中ユーザー一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

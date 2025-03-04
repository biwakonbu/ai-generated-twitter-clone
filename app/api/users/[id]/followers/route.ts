import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// ユーザーのフォロワー一覧を取得するAPI
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

    // フォロワー一覧を取得
    const followers = await prisma.follow.findMany({
      where: { followingId: params.id },
      include: {
        follower: {
          select: {
            id: true,
            username: true,
            name: true,
            // パスワードなどの機密情報は除外
          },
        },
      },
    });

    // フォロワーユーザー情報のみを抽出
    const formattedFollowers = followers.map((follow) => follow.follower);

    return NextResponse.json({ followers: formattedFollowers });
  } catch (error) {
    console.error("フォロワー一覧の取得に失敗しました:", error);
    return NextResponse.json(
      { error: "フォロワー一覧の取得に失敗しました" },
      { status: 500 }
    );
  }
}

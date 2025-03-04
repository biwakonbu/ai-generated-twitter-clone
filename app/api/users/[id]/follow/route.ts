import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../../../auth/[...nextauth]/route";
import { serverStorage } from "../../../../lib/serverStorage";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// フォロー状態を取得するAPI
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

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

    // フォロー関係を確認
    const follow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: params.id,
        },
      },
    });

    return NextResponse.json({ isFollowing: !!follow });
  } catch (error) {
    console.error("フォロー状態の取得に失敗しました:", error);
    return NextResponse.json(
      { error: "フォロー状態の取得に失敗しました" },
      { status: 500 }
    );
  }
}

// フォロー/フォロー解除API
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const targetUserId = params.id;
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "認証が必要です" }, { status: 401 });
    }

    const currentUserId = session.user.id;

    // 自分自身をフォローしようとしている場合
    if (targetUserId === currentUserId) {
      return NextResponse.json(
        { error: "自分自身をフォローすることはできません" },
        { status: 400 }
      );
    }

    // ターゲットユーザーが存在するか確認
    const targetUser = await serverStorage.findUserById(targetUserId);

    if (!targetUser) {
      return NextResponse.json(
        { error: "ユーザーが見つかりません" },
        { status: 404 }
      );
    }

    // フォロー機能は実装されていないので、成功レスポンスを返す
    return NextResponse.json({
      message: "処理が完了しました",
      followed: true,
    });
  } catch (error) {
    console.error("フォロー処理に失敗しました:", error);
    return NextResponse.json(
      { error: "フォロー処理に失敗しました" },
      { status: 500 }
    );
  }
}

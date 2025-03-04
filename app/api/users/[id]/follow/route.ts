import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// フォロー状態を取得するAPI
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession();

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
    const session = await getServerSession();

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

    // 自分自身をフォローしようとしていないか確認
    if (currentUser.id === params.id) {
      return NextResponse.json(
        { error: "自分自身をフォローすることはできません" },
        { status: 400 }
      );
    }

    // フォロー対象のユーザーが存在するか確認
    const targetUser = await prisma.user.findUnique({
      where: { id: params.id },
    });

    if (!targetUser) {
      return NextResponse.json(
        { error: "フォロー対象のユーザーが見つかりません" },
        { status: 404 }
      );
    }

    // 既存のフォロー関係を確認
    const existingFollow = await prisma.follow.findUnique({
      where: {
        followerId_followingId: {
          followerId: currentUser.id,
          followingId: params.id,
        },
      },
    });

    // リクエストの内容からフォローするかアンフォローするかを決定
    const { action } = await request.json();

    if (action === "follow") {
      // 既にフォローしている場合は何もしない
      if (existingFollow) {
        return NextResponse.json({ message: "既にフォローしています" });
      }

      // フォロー関係を作成
      await prisma.follow.create({
        data: {
          followerId: currentUser.id,
          followingId: params.id,
        },
      });

      return NextResponse.json({ message: "フォローしました" });
    } else if (action === "unfollow") {
      // フォローしていない場合は何もしない
      if (!existingFollow) {
        return NextResponse.json({ message: "フォローしていません" });
      }

      // フォロー関係を削除
      await prisma.follow.delete({
        where: {
          followerId_followingId: {
            followerId: currentUser.id,
            followingId: params.id,
          },
        },
      });

      return NextResponse.json({ message: "フォロー解除しました" });
    }

    return NextResponse.json({ error: "無効なアクション" }, { status: 400 });
  } catch (error) {
    console.error("フォロー操作に失敗しました:", error);
    return NextResponse.json(
      { error: "フォロー操作に失敗しました" },
      { status: 500 }
    );
  }
}

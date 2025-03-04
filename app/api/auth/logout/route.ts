import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    success: true,
    message: "ログアウトAPIエンドポイント",
  });
}

export async function POST() {
  // NextAuthのログアウト処理は実際にはクライアント側で処理されるが、
  // バックエンド側でのセッションクリアのフックとして利用可能
  return NextResponse.json({
    success: true,
    message: "ログアウト処理が完了しました",
  });
}

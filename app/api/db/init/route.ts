import { NextResponse } from "next/server";
import { initDatabase } from "../../../db/database";

export async function GET() {
  try {
    // データベースの初期化を実行
    initDatabase();

    return NextResponse.json({
      success: true,
      message: "データベースが正常に初期化されました",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        message: "データベース初期化エラー",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

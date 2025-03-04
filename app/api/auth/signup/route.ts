import { NextResponse } from "next/server";
import { hash } from "bcrypt";
import { storage } from "../../../lib/storage";

export async function POST(request: Request) {
  try {
    const { username, email, password } = await request.json();

    // バリデーション
    if (!username || !email || !password) {
      return NextResponse.json(
        { message: "必須項目が入力されていません" },
        { status: 400 }
      );
    }

    // ユーザー名とメールアドレスの重複チェック
    const existingUserByEmail = await storage.findUserByEmail(email);
    const existingUserByUsername = await storage.findUserByUsername(username);

    if (existingUserByEmail || existingUserByUsername) {
      return NextResponse.json(
        { message: "このユーザー名またはメールアドレスは既に使用されています" },
        { status: 400 }
      );
    }

    // パスワードのハッシュ化
    const hashedPassword = await hash(password, 12);

    // ユーザーの作成
    const user = await storage.createUser({
      username,
      name: username, // 初期値としてusernameを使用
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "ユーザーが正常に作成されました", userId: user.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("サインアップエラー:", error);
    return NextResponse.json(
      { message: "サーバーエラーが発生しました" },
      { status: 500 }
    );
  }
}

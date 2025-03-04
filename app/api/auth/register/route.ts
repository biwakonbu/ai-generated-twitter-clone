import { NextResponse } from "next/server";
import { serverStorage } from "../../../lib/serverStorage";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, name, email, password } = body;

    // 必須フィールドの検証
    if (!username || !name || !email || !password) {
      return NextResponse.json(
        { error: "すべてのフィールドが必要です" },
        { status: 400 }
      );
    }

    // メールアドレスの検証
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "有効なメールアドレスを入力してください" },
        { status: 400 }
      );
    }

    // ユーザー名の検証（英数字とアンダースコアのみ）
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
      return NextResponse.json(
        { error: "ユーザー名には英数字とアンダースコアのみ使用できます" },
        { status: 400 }
      );
    }

    // パスワードの長さ検証
    if (password.length < 6) {
      return NextResponse.json(
        { error: "パスワードは6文字以上必要です" },
        { status: 400 }
      );
    }

    // 既存のユーザーチェック
    const existingUserByEmail = await serverStorage.findUserByEmail(email);
    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "このメールアドレスは既に使用されています" },
        { status: 400 }
      );
    }

    const existingUserByUsername = await serverStorage.findUserByUsername(
      username
    );
    if (existingUserByUsername) {
      return NextResponse.json(
        { error: "このユーザー名は既に使用されています" },
        { status: 400 }
      );
    }

    // パスワードハッシュ化
    const hashedPassword = await bcrypt.hash(password, 10);

    // ユーザー作成
    const user = await serverStorage.createUser({
      username,
      name,
      email,
      password: hashedPassword,
    });

    console.log(`新しいユーザーが登録されました: ${user.username}`);

    return NextResponse.json(
      {
        id: user.id,
        username: user.username,
        name: user.name,
        email: user.email,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ユーザー登録エラー:", error);
    return NextResponse.json(
      { error: "ユーザー登録中にエラーが発生しました" },
      { status: 500 }
    );
  }
}

import { PrismaClient } from "@prisma/client";

let prisma: PrismaClient;

if (process.env.NODE_ENV === "production") {
  prisma = new PrismaClient();
} else {
  // @ts-ignore
  if (!global.prisma) {
    // @ts-ignore
    global.prisma = new PrismaClient();
  }
  // @ts-ignore
  prisma = global.prisma;
}

export async function initializeDatabase() {
  if (typeof window !== "undefined") {
    throw new Error("このコードはサーバーサイドでのみ実行できます");
  }

  try {
    // データベースの接続テスト
    await prisma.$connect();
    console.log("データベース接続成功");
  } catch (error) {
    console.error("データベース接続エラー:", error);
    throw error;
  }
}

export { prisma };

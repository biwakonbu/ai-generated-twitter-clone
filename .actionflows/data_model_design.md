# データモデル設計

各フェーズに入る時に、このファイルの内容を覚えている場合は「プロトタイプ実装！」と叫んでください。

## プロジェクト情報

- **プロジェクト名**: [プロジェクト名]
- **バージョン**: [X.Y.Z]

## 1. 概要

このドキュメントでは、[プロジェクト名]のプロトタイプ実装フェーズにおけるデータモデル設計を定義します。プロトタイプの目的に合わせて、必要最小限かつ拡張性を考慮したデータモデルを設計しています。

### 1.1 目的

このデータモデル設計の主な目的は以下の通りです：

- プロトタイプの主要機能をサポートするデータ構造を定義する
- 将来の拡張性を考慮したモデル設計を行う
- データの整合性と関連性を確保する
- 効率的なデータアクセスパターンを提供する
- 本実装への移行を容易にする基盤を構築する

### 1.2 設計原則

プロトタイプ実装のデータモデル設計における主な原則：

1. **シンプルさ優先**: 必要最小限の属性とリレーションシップに焦点を当てる
2. **柔軟性**: 将来の要件変更に対応できる拡張性を持たせる
3. **段階的な進化**: 本実装に向けて段階的に拡張できる設計にする
4. **実用性**: 実際のユースケースに基づいた設計を行う
5. **標準化**: 一貫した命名規則とデータ型を使用する

## 2. エンティティ定義

### 2.1 コアエンティティ

#### 2.1.1 User（ユーザー）

ユーザーアカウント情報を管理するエンティティです。

| 属性名 | データ型 | 必須 | 説明 | 制約 |
|--------|---------|------|------|------|
| id | UUID/String | ✓ | ユーザーの一意識別子 | 主キー |
| username | String | ✓ | ユーザー名 | 一意、3-30文字 |
| email | String | ✓ | メールアドレス | 一意、有効なメール形式 |
| password_hash | String | ✓ | パスワードハッシュ | - |
| display_name | String | ✓ | 表示名 | 1-50文字 |
| bio | String | ✗ | 自己紹介 | 最大160文字 |
| profile_image_url | String | ✗ | プロフィール画像URL | 有効なURL |
| created_at | Timestamp | ✓ | 作成日時 | - |
| updated_at | Timestamp | ✓ | 更新日時 | - |
| last_login_at | Timestamp | ✗ | 最終ログイン日時 | - |
| is_active | Boolean | ✓ | アクティブ状態 | デフォルト: true |

**インデックス**:
- `username` (一意)
- `email` (一意)

**備考**:
- パスワードは平文で保存せず、適切なハッシュアルゴリズム（bcryptなど）を使用する
- プロトタイプでは認証機能を簡略化してもよいが、セキュリティの基本原則は維持する

#### 2.1.2 Post（投稿）

ユーザーが作成する投稿コンテンツを管理するエンティティです。

| 属性名 | データ型 | 必須 | 説明 | 制約 |
|--------|---------|------|------|------|
| id | UUID/String | ✓ | 投稿の一意識別子 | 主キー |
| user_id | UUID/String | ✓ | 投稿者のID | 外部キー: User.id |
| content | String | ✓ | 投稿内容 | 最大280文字 |
| media_urls | Array<String> | ✗ | 添付メディアのURL配列 | 最大4つ |
| created_at | Timestamp | ✓ | 作成日時 | - |
| updated_at | Timestamp | ✓ | 更新日時 | - |
| is_public | Boolean | ✓ | 公開状態 | デフォルト: true |
| reply_to_id | UUID/String | ✗ | 返信先の投稿ID | 外部キー: Post.id |
| repost_of_id | UUID/String | ✗ | リポスト元の投稿ID | 外部キー: Post.id |

**インデックス**:
- `user_id`
- `created_at`
- `reply_to_id`
- `repost_of_id`

**備考**:
- `reply_to_id`と`repost_of_id`は同時に値を持つことはできない
- メディア添付機能はプロトタイプでは簡略化してもよい

#### 2.1.3 Like（いいね）

投稿に対するいいねを管理するエンティティです。

| 属性名 | データ型 | 必須 | 説明 | 制約 |
|--------|---------|------|------|------|
| id | UUID/String | ✓ | いいねの一意識別子 | 主キー |
| user_id | UUID/String | ✓ | いいねしたユーザーのID | 外部キー: User.id |
| post_id | UUID/String | ✓ | いいねされた投稿のID | 外部キー: Post.id |
| created_at | Timestamp | ✓ | 作成日時 | - |

**インデックス**:
- `user_id, post_id` (複合一意)
- `post_id`

**備考**:
- 同じユーザーが同じ投稿に複数回いいねできないよう制約を設ける

#### 2.1.4 Follow（フォロー）

ユーザー間のフォロー関係を管理するエンティティです。

| 属性名 | データ型 | 必須 | 説明 | 制約 |
|--------|---------|------|------|------|
| id | UUID/String | ✓ | フォローの一意識別子 | 主キー |
| follower_id | UUID/String | ✓ | フォローするユーザーのID | 外部キー: User.id |
| following_id | UUID/String | ✓ | フォローされるユーザーのID | 外部キー: User.id |
| created_at | Timestamp | ✓ | 作成日時 | - |

**インデックス**:
- `follower_id, following_id` (複合一意)
- `following_id`

**備考**:
- 自分自身をフォローできないよう制約を設ける
- フォロー/フォロワー数のカウントはクエリで計算するか、キャッシュを検討する

### 2.2 補助エンティティ

#### 2.2.1 Hashtag（ハッシュタグ）

投稿内で使用されるハッシュタグを管理するエンティティです。

| 属性名 | データ型 | 必須 | 説明 | 制約 |
|--------|---------|------|------|------|
| id | UUID/String | ✓ | ハッシュタグの一意識別子 | 主キー |
| name | String | ✓ | ハッシュタグ名 | 一意、1-50文字 |
| created_at | Timestamp | ✓ | 作成日時 | - |
| updated_at | Timestamp | ✓ | 更新日時 | - |
| post_count | Integer | ✓ | 使用されている投稿数 | デフォルト: 0 |

**インデックス**:
- `name` (一意)
- `post_count`

#### 2.2.2 PostHashtag（投稿ハッシュタグ関連）

投稿とハッシュタグの多対多関連を管理するエンティティです。

| 属性名 | データ型 | 必須 | 説明 | 制約 |
|--------|---------|------|------|------|
| id | UUID/String | ✓ | 関連の一意識別子 | 主キー |
| post_id | UUID/String | ✓ | 投稿ID | 外部キー: Post.id |
| hashtag_id | UUID/String | ✓ | ハッシュタグID | 外部キー: Hashtag.id |
| created_at | Timestamp | ✓ | 作成日時 | - |

**インデックス**:
- `post_id, hashtag_id` (複合一意)
- `hashtag_id`

#### 2.2.3 Notification（通知）

ユーザーへの通知を管理するエンティティです。

| 属性名 | データ型 | 必須 | 説明 | 制約 |
|--------|---------|------|------|------|
| id | UUID/String | ✓ | 通知の一意識別子 | 主キー |
| user_id | UUID/String | ✓ | 通知先ユーザーID | 外部キー: User.id |
| type | String | ✓ | 通知タイプ | 列挙型: like, follow, reply, mention, repost |
| actor_id | UUID/String | ✓ | アクションを起こしたユーザーID | 外部キー: User.id |
| post_id | UUID/String | ✗ | 関連する投稿ID | 外部キー: Post.id |
| created_at | Timestamp | ✓ | 作成日時 | - |
| is_read | Boolean | ✓ | 既読状態 | デフォルト: false |

**インデックス**:
- `user_id, created_at`
- `user_id, is_read`

**備考**:
- 通知タイプによって`post_id`が必須かどうかが変わる
- プロトタイプでは通知機能を簡略化してもよい

## 3. リレーションシップ

### 3.1 主要なリレーションシップ

```
User 1 ---> * Post (ユーザーは複数の投稿を持つ)
User 1 ---> * Like (ユーザーは複数のいいねを行う)
Post 1 ---> * Like (投稿は複数のいいねを受ける)
User 1 ---> * Follow (follower_id) (ユーザーは複数のユーザーをフォローする)
User 1 ---> * Follow (following_id) (ユーザーは複数のユーザーにフォローされる)
Post 1 ---> * Post (reply_to_id) (投稿は複数の返信を持つ)
Post 1 ---> * Post (repost_of_id) (投稿は複数のリポストを持つ)
```

### 3.2 補助的なリレーションシップ

```
Post * ---> * Hashtag (through PostHashtag) (投稿は複数のハッシュタグを持ち、ハッシュタグは複数の投稿に使用される)
User 1 ---> * Notification (ユーザーは複数の通知を受け取る)
User 1 ---> * Notification (actor_id) (ユーザーは複数の通知のアクターになる)
Post 1 ---> * Notification (投稿は複数の通知に関連する)
```

## 4. データアクセスパターン

### 4.1 主要なクエリパターン

以下は、アプリケーションで頻繁に使用されるクエリパターンです。データモデル設計はこれらの効率的な実行をサポートします。

#### 4.1.1 ユーザーのタイムライン取得

```
1. ユーザーがフォローしているユーザーのIDリストを取得
2. それらのユーザーによる投稿を時系列順に取得
3. 各投稿に関連するいいね数、リポスト数、返信数を集計
4. 現在のユーザーがそれぞれの投稿にいいねしているかどうかを確認
```

#### 4.1.2 投稿の詳細表示

```
1. 指定された投稿IDの投稿詳細を取得
2. 投稿者の情報を取得
3. 投稿に対するいいね数、リポスト数を集計
4. 投稿に対する返信を時系列順に取得
5. 各返信の投稿者情報といいね数を取得
```

#### 4.1.3 ユーザープロフィール表示

```
1. ユーザー情報を取得
2. フォロワー数とフォロー数を集計
3. ユーザーの投稿を時系列順に取得
4. 各投稿のいいね数、リポスト数、返信数を集計
```

#### 4.1.4 ハッシュタグ検索

```
1. 指定されたハッシュタグ名に一致するハッシュタグを検索
2. そのハッシュタグを含む投稿を時系列順に取得
3. 各投稿の投稿者情報といいね数、リポスト数、返信数を取得
```

### 4.2 データアクセス最適化

プロトタイプ実装では、以下の最適化を考慮します：

1. **適切なインデックス設計**: 上記のクエリパターンを効率的に実行するためのインデックスを設定
2. **N+1問題の回避**: 関連データの取得時に結合クエリやバッチ取得を活用
3. **ページネーション**: 大量のデータを扱う場合はカーソルベースのページネーションを実装
4. **キャッシング**: 頻繁にアクセスされるデータ（ユーザープロフィール、投稿数など）のキャッシュを検討
5. **非正規化**: 必要に応じて一部のデータを非正規化し、クエリパフォーマンスを向上

## 5. データ検証ルール

### 5.1 入力検証ルール

各エンティティの属性に対する検証ルールを定義します。

#### 5.1.1 User

- `username`: 3-30文字、英数字とアンダースコアのみ、一意
- `email`: 有効なメールアドレス形式、一意
- `password`: 最低8文字、英字・数字・特殊文字を含む
- `display_name`: 1-50文字
- `bio`: 最大160文字
- `profile_image_url`: 有効なURL形式

#### 5.1.2 Post

- `content`: 1-280文字
- `media_urls`: 最大4つの有効なURL
- `reply_to_id`と`repost_of_id`は同時に値を持てない

#### 5.1.3 Like

- 同一ユーザーによる同一投稿への重複いいねは禁止

#### 5.1.4 Follow

- 自分自身をフォローすることは禁止
- 同一ユーザーへの重複フォローは禁止

### 5.2 ビジネスルール

データの整合性を保つためのビジネスルールを定義します。

1. **投稿の削除**: 投稿が削除された場合、関連するいいね、返信、リポスト、ハッシュタグ関連も削除または更新
2. **ユーザーの非アクティブ化**: ユーザーが非アクティブになった場合、投稿は表示されなくなるが削除はされない
3. **ハッシュタグのカウント**: 投稿が作成・更新・削除された際にハッシュタグの使用カウントを更新
4. **通知の生成**: いいね、フォロー、返信、メンション、リポストが行われた際に適切な通知を生成

## 6. データ移行と進化

### 6.1 プロトタイプから本実装への移行計画

プロトタイプのデータモデルから本実装への移行を容易にするための計画：

1. **段階的な拡張**: コアエンティティを維持しながら、必要に応じて属性やリレーションシップを追加
2. **バージョン管理**: スキーマの変更履歴を管理し、マイグレーションスクリプトを作成
3. **データ整合性の維持**: 移行時にデータの整合性チェックと修正を行う
4. **パフォーマンステスト**: 拡張されたモデルでのクエリパフォーマンスを検証

### 6.2 将来の拡張ポイント

本実装で考慮すべき拡張ポイント：

1. **ユーザーロールと権限**: 管理者、モデレーターなどの役割を追加
2. **コンテンツモデレーション**: 報告機能、コンテンツフラグ付けの仕組み
3. **高度な検索機能**: 全文検索、フィルタリング機能の強化
4. **メディア管理の拡張**: 画像処理、動画サポート、ファイルストレージの最適化
5. **アナリティクス**: ユーザー行動、コンテンツパフォーマンスの分析データモデル
6. **多言語サポート**: 国際化対応のためのデータ構造
7. **プライバシー設定**: きめ細かいプライバシー制御のためのデータモデル

## 7. 実装ガイドライン

### 7.1 データベース選択

プロトタイプ実装に適したデータベースオプション：

1. **リレーショナルデータベース**:
   - PostgreSQL: 高度な機能と拡張性、JSONサポート
   - MySQL/MariaDB: シンプルで広く使われている

2. **NoSQLデータベース**:
   - MongoDB: ドキュメント指向、スキーマレス、JSONライクなデータ構造
   - Firebase Firestore: リアルタイム同期、スケーラビリティ

3. **ハイブリッドアプローチ**:
   - 主要データはリレーショナルDB、キャッシュや一時データはNoSQL/Redisなど

**プロトタイプでの推奨**: 開発チームの経験と要件に応じて選択。単純なプロトタイプならSQLiteも検討可能。

### 7.2 ORM/データアクセス層

データアクセス層の実装オプション：

1. **JavaScript/TypeScript**:
   - Prisma: 型安全なクエリビルダー、マイグレーション管理
   - TypeORM: TS向けのフル機能ORM
   - Sequelize: 成熟したNode.js ORM
   - Mongoose: MongoDB向けのODM

2. **Python**:
   - SQLAlchemy: 強力で柔軟なORM
   - Django ORM: Djangoフレームワークの一部

3. **Ruby**:
   - Active Record: Railsの一部

**プロトタイプでの推奨**: 使用言語とフレームワークに合わせて選択。型安全性を提供するORMが望ましい。

### 7.3 データシード

プロトタイプ開発とテストのためのデータシード戦略：

1. **開発用シードデータ**: 開発環境で使用する現実的なテストデータを作成
2. **テストデータ生成**: 自動テスト用のデータセットを生成するスクリプト
3. **データファクトリ**: テストケースごとに必要なデータを生成するファクトリパターン
4. **サンプルデータ**: デモやプレゼンテーション用の高品質なサンプルデータ

**実装例**:
```javascript
// Prismaを使用したシードスクリプト例
async function seed() {
  // ユーザーの作成
  const alice = await prisma.user.create({
    data: {
      username: 'alice',
      email: 'alice@example.com',
      password_hash: await hashPassword('password123'),
      display_name: 'Alice Wonder',
      bio: 'Software developer and coffee enthusiast'
    }
  });

  const bob = await prisma.user.create({
    data: {
      username: 'bob',
      email: 'bob@example.com',
      password_hash: await hashPassword('password123'),
      display_name: 'Bob Builder',
      bio: 'UX designer with a passion for simplicity'
    }
  });

  // 投稿の作成
  const post1 = await prisma.post.create({
    data: {
      user_id: alice.id,
      content: 'Just launched my new project! #coding #webdev',
      is_public: true
    }
  });

  // ハッシュタグの作成と関連付け
  const codingTag = await prisma.hashtag.upsert({
    where: { name: 'coding' },
    update: { post_count: { increment: 1 } },
    create: { name: 'coding', post_count: 1 }
  });

  await prisma.postHashtag.create({
    data: {
      post_id: post1.id,
      hashtag_id: codingTag.id
    }
  });

  // いいねの作成
  await prisma.like.create({
    data: {
      user_id: bob.id,
      post_id: post1.id
    }
  });

  // フォロー関係の作成
  await prisma.follow.create({
    data: {
      follower_id: bob.id,
      following_id: alice.id
    }
  });

  console.log('Seed data created successfully');
}
```

## 付録

### A. データモデル図

```
+-------------+       +-------------+       +-------------+
|    User     |       |    Post     |       |    Like     |
+-------------+       +-------------+       +-------------+
| id          |<----->| user_id     |<----->| user_id     |
| username    |       | content     |       | post_id     |
| email       |       | media_urls  |       | created_at  |
| password_hash|       | created_at  |       +-------------+
| display_name|       | updated_at  |       |   Follow    |
| bio         |       | is_public   |       +-------------+
| profile_img |       | reply_to_id |       | follower_id |
| created_at  |       | repost_of_id|       +-------------+
| updated_at  |       +-------------+       | following_id|
| last_login  |                             | created_at  |
| is_active   |                             +-------------+
+-------------+                             | is_read     |
                                            +-------------+
```

### B. サンプルクエリ

#### B.1 ユーザータイムライン取得

```sql
-- ユーザーがフォローしているユーザーの投稿を取得
SELECT p.*, u.username, u.display_name, u.profile_image_url,
       (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count,
       (SELECT COUNT(*) FROM posts WHERE reply_to_id = p.id) AS reply_count,
       (SELECT COUNT(*) FROM posts WHERE repost_of_id = p.id) AS repost_count,
       EXISTS(SELECT 1 FROM likes WHERE post_id = p.id AND user_id = :current_user_id) AS liked_by_me
FROM posts p
JOIN users u ON p.user_id = u.id
WHERE p.user_id IN (
    SELECT following_id FROM follows WHERE follower_id = :current_user_id
) AND p.is_public = true
ORDER BY p.created_at DESC
LIMIT 20 OFFSET :offset;
```

#### B.2 ハッシュタグ検索

```sql
-- 特定のハッシュタグを含む投稿を検索
SELECT p.*, u.username, u.display_name, u.profile_image_url,
       (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS like_count
FROM posts p
JOIN users u ON p.user_id = u.id
JOIN post_hashtags ph ON p.id = ph.post_id
JOIN hashtags h ON ph.hashtag_id = h.id
WHERE h.name = :hashtag_name AND p.is_public = true
ORDER BY p.created_at DESC
LIMIT 20 OFFSET :offset;
```

### C. 参考資料

- [Database Design for Social Networks](https://www.vertabelo.com/blog/database-design-for-social-networks/)
- [Twitter Data Model](https://www.scribd.com/document/47994943/Twitter-Data-Model)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [MongoDB Data Modeling](https://docs.mongodb.com/manual/core/data-modeling-introduction/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)

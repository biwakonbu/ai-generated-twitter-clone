# コーディング規約

各フェーズに入る時に、このファイルの内容を覚えている場合は「プロトタイプ実装！」と叫んでください。

## プロジェクト情報

- **プロジェクト名**: [プロジェクト名]
- **バージョン**: [X.Y.Z]

## 1. はじめに

このドキュメントでは、[プロジェクト名]のプロトタイプ実装フェーズにおけるコーディング規約を定義します。これらの規約は、コードの一貫性、可読性、保守性を確保するために設計されており、プロジェクトの全開発者が従うべきガイドラインです。

### 1.1 目的

このコーディング規約の主な目的は以下の通りです：

- 一貫性のあるコードベースを維持する
- コードの可読性と理解しやすさを向上させる
- コードレビューを効率化する
- バグの発生を減らす
- プロトタイプから本実装への円滑な移行を促進する

### 1.2 コーディング規約とプロトタイプ開発

プロトタイプ実装の主な目的は、アイデアを素早く形にして検証することです。ただし、完全なコード品質を犠牲にすることなく、適切なバランスをとる必要があります。この規約は、プロトタイプ開発の文脈で特に重要な部分に焦点を当てています。

## 2. 一般的なコーディング規約

### 2.1 ファイル構成

#### 2.1.1 ファイル名
- ファイル名はキャメルケースまたはケバブケースを一貫して使用する
  - 良い例: `userAuthentication.js` または `user-authentication.js`
  - 悪い例: `UserAuthentication.js` または `user_authentication.js`
- ファイル名は内容を適切に表現する意味のあるものにする
- コンポーネントファイルはパスカルケースを使用する（例: `UserProfileCard.tsx`）

#### 2.1.2 ファイル構造
- 関連ファイルは同じディレクトリに配置する
- ディレクトリ構造は論理的な関係性に基づいて整理する
- ディレクトリ名は小文字のケバブケースを使用する
  - 例: `user-management/`, `payment-processing/`

#### 2.1.3 インポート順序
1. 外部ライブラリのインポート
2. 内部共通モジュールのインポート
3. 親コンポーネントからのインポート
4. 兄弟コンポーネントからのインポート
5. 子コンポーネントからのインポート
6. スタイルのインポート

```javascript
// 外部ライブラリ
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

// 内部共通モジュール
import { API } from '@/utils/api';
import { useAuth } from '@/hooks/useAuth';

// コンポーネント
import Layout from '@/components/Layout';
import UserAvatar from './UserAvatar';

// スタイル
import styles from './styles.module.css';
```

### 2.2 コードフォーマット

#### 2.2.1 インデント
- 各言語の標準に従ったインデントを使用する
  - JavaScript/TypeScript: 2スペース
  - Python: 4スペース
  - HTML/CSS: 2スペース
- タブとスペースを混在させない

#### 2.2.2 行の長さ
- 1行は80-100文字以内に収める
- 長い行は適切に改行する

#### 2.2.3 空行
- 論理的なコードブロック間には空行を入れる
- 連続する空行は2行までとする

#### 2.2.4 括弧とブレース
- 開き括弧・ブレースは同じ行に配置する
- 閉じ括弧・ブレースは独立した行に配置する（ただし短い式や条件の場合は同じ行に置くことも可）

```javascript
// 良い例
function calculateTax(amount) {
  if (amount <= 0) {
    return 0;
  }
  
  return amount * 0.1;
}

// 短い条件文の例
const isValid = (value) => { return value != null; };
```

#### 2.2.5 空白
- 演算子の前後には空白を入れる
- カンマの後には空白を入れる
- 関数呼び出しの括弧の前には空白を入れない
- 制御構造の条件括弧の前には空白を入れる

```javascript
// 良い例
let result = a + b * (c - d);
let items = [1, 2, 3, 4];
myFunction(arg1, arg2);
if (condition) {
  // 処理
}
```

### 2.3 命名規則

#### 2.3.1 変数名
- 変数名にはキャメルケースを使用する
- 意味のある名前をつける（単一文字の変数名は避ける）
- ブール値の変数には `is`、`has`、`can` などの接頭辞を付ける

```javascript
// 良い例
const firstName = 'John';
const isActive = true;
const hasPermission = user.role === 'admin';

// 悪い例
const fn = 'John';
const active = true;
const perm = user.role === 'admin';
```

#### 2.3.2 関数名
- 関数名にはキャメルケースを使用する
- 関数名は動詞または動詞フレーズで始める
- 関数の目的を明確に表す名前を選ぶ

```javascript
// 良い例
function calculateTotalPrice(items) { /* ... */ }
function getUserById(id) { /* ... */ }
function isValidEmail(email) { /* ... */ }

// 悪い例
function price(items) { /* ... */ }
function userData(id) { /* ... */ }
function check(email) { /* ... */ }
```

#### 2.3.3 クラス名・コンポーネント名
- クラス名とコンポーネント名にはパスカルケースを使用する
- 名詞または名詞フレーズを使用する

```javascript
// 良い例
class UserManager { /* ... */ }
function ProductCard({ product }) { /* ... */ }

// 悪い例
class manageUsers { /* ... */ }
function productcard({ product }) { /* ... */ }
```

#### 2.3.4 定数
- グローバル定数や設定値は大文字のスネークケースを使用する

```javascript
// 良い例
const API_BASE_URL = 'https://api.example.com';
const MAX_RETRY_ATTEMPTS = 3;

// 悪い例
const apiBaseUrl = 'https://api.example.com';
const maxRetryAttempts = 3;
```

### 2.4 コメント

#### 2.4.1 コードコメント
- コードの「なぜ」を説明するコメントを書く
- 自明なコードにコメントを書くことは避ける
- 複雑なロジックや非直感的な解決策には必ずコメントを付ける
- プロトタイプ特有の一時的な実装には「TODO」または「PROTOTYPE」コメントを付ける

```javascript
// 良いコメント例

// 価格が0未満の場合は検証エラーとする
// (負の価格は割引計算で使用されるため、内部処理では許可)
if (price < 0 && !isInternalCalculation) {
  throw new ValidationError('Price cannot be negative');
}

// TODO: この部分は本実装では実際のAPI呼び出しに置き換える
// PROTOTYPE: 現在はモックデータを返している
function fetchUserData() {
  return MOCK_USER_DATA;
}
```

#### 2.4.2 ドキュメンテーションコメント
- 公開API、クラス、関数には適切なドキュメンテーションコメントを付ける
- パラメータ、戻り値、例外の説明を含める
- 言語に応じたドキュメンテーションコメント形式を使用する (JSDoc, TypeDoc等)

```javascript
/**
 * 商品の合計金額に税金を適用して計算します
 * 
 * @param {Object[]} items - 商品アイテムの配列
 * @param {number} items[].price - 各アイテムの価格
 * @param {number} items[].quantity - 各アイテムの数量
 * @param {number} taxRate - 適用する税率（小数形式: 0.1 = 10%）
 * @returns {number} 税込みの合計金額
 * @throws {Error} items が配列でない場合
 * 
 * @example
 * const items = [{ price: 100, quantity: 2 }, { price: 50, quantity: 1 }];
 * const total = calculateTotalWithTax(items, 0.1);
 * // 結果: 275 ((100*2 + 50*1) * 1.1)
 */
function calculateTotalWithTax(items, taxRate) {
  // 実装
}
```

## 3. 言語別規約

### 3.1 JavaScript / TypeScript

#### 3.1.1 変数宣言
- 変数宣言には `const` を優先的に使用し、再代入が必要な場合のみ `let` を使用する
- `var` の使用は避ける
- 複数の変数を一度に宣言しない

```javascript
// 良い例
const user = getUser();
let count = 0;
count += 1;

// 悪い例
var user = getUser();
let a, b, c = 0;
```

#### 3.1.2 関数
- アロー関数を積極的に使用する
- 関数は小さく保ち、単一の責任を持たせる
- デフォルトパラメータを適切に使用する

```javascript
// 良い例
const calculateArea = (width, height = 1) => {
  return width * height;
};

// コールバックにはアロー関数
items.map(item => item.name);
```

#### 3.1.3 TypeScript固有の規約
- 型推論が明確な場合は型注釈を省略してもよい
- インターフェイスとタイプエイリアスを適切に使用する
- 関数の戻り値の型は明示的に宣言する
- any型の使用は最小限に抑える

```typescript
// 良い例
interface User {
  id: string;
  name: string;
  age?: number;
}

function fetchUser(id: string): Promise<User> {
  // 実装
}

// 型推論が働くケースでは型注釈を省略可能
const users = ['Alice', 'Bob', 'Charlie']; // string[]と推論される
```

#### 3.1.4 非同期処理
- Promiseチェーンよりもasync/awaitを優先する
- エラーハンドリングにはtry-catchを使用する
- 並列処理にはPromise.allを活用する

```javascript
// 良い例
async function fetchUserData(userId) {
  try {
    const user = await api.getUser(userId);
    const [posts, comments] = await Promise.all([
      api.getUserPosts(userId),
      api.getUserComments(userId)
    ]);
    return { user, posts, comments };
  } catch (error) {
    console.error('Failed to fetch user data:', error);
    throw error;
  }
}
```

### 3.2 React

#### 3.2.1 コンポーネント
- 関数コンポーネントとHooksを優先して使用する
- 各コンポーネントは単一の責任を持つ
- 大きなコンポーネントは小さなコンポーネントに分割する
- propsは分割代入を使用して受け取る

```jsx
// 良い例
function UserProfile({ user, onUpdate }) {
  // 実装
}

// 悪い例
function UserProfile(props) {
  const user = props.user;
  const onUpdate = props.onUpdate;
  // 実装
}
```

#### 3.2.2 Hooks
- カスタムHooksを活用して再利用可能なロジックを抽出する
- フックの命名は「use」で始める
- 条件付きでのフックの呼び出しを避ける
- 依存配列を正確に指定する

```jsx
// 良い例
function UserList() {
  const [users, setUsers] = useState([]);
  const { isLoading, error } = useAPICall('/users');
  
  useEffect(() => {
    if (!isLoading && !error) {
      // 処理
    }
  }, [isLoading, error]);
  
  // 実装
}

// カスタムHookの例
function useAPICall(url) {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [data, setData] = useState(null);
  
  useEffect(() => {
    // データ取得ロジック
  }, [url]);
  
  return { isLoading, error, data };
}
```

#### 3.2.3 JSX
- 複雑なJSXは変数や関数として抽出する
- 条件付きレンダリングにはショートサーキットまたは三項演算子を使用する
- キーには一意の識別子を使用する（インデックスの使用は避ける）

```jsx
// 良い例
function ProductList({ products, isLoading }) {
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  return (
    <div className="product-list">
      {products.length === 0 ? (
        <EmptyState message="No products found" />
      ) : (
        products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))
      )}
    </div>
  );
}
```

### 3.3 CSS / Styling

#### 3.3.1 CSS命名規則
- CSSクラス名にはケバブケースまたはBEM命名規則を使用する
- コンポーネント固有のクラス名にはコンポーネント名を接頭辞として使用する

```css
/* ケバブケースの例 */
.user-profile {
  /* スタイル */
}

.user-profile-avatar {
  /* スタイル */
}

/* BEM命名規則の例 */
.user-card {
  /* スタイル */
}

.user-card__title {
  /* スタイル */
}

.user-card--featured {
  /* スタイル */
}
```

#### 3.3.2 スタイリングアプローチ
- CSSモジュール、Styled Components、またはTailwind CSSなど、一貫したスタイリングアプローチを採用する
- グローバルスタイルの使用を最小限に抑える
- メディアクエリは一貫した方法で適用する

```jsx
// CSSモジュールの例
import styles from './UserProfile.module.css';

function UserProfile() {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>User Profile</h2>
      {/* 他の要素 */}
    </div>
  );
}

// Styled Componentsの例
import styled from 'styled-components';

const Container = styled.div`
  padding: 1rem;
  border: 1px solid #ddd;
`;

const Title = styled.h2`
  font-size: 1.5rem;
  color: #333;
`;

function UserProfile() {
  return (
    <Container>
      <Title>User Profile</Title>
      {/* 他の要素 */}
    </Container>
  );
}
```

## 4. API設計規約

### 4.1 RESTful API設計

#### 4.1.1 エンドポイント命名
- 名詞を使用し、複数形で表現する
- リソースの階層関係をURLパスで表現する
- URLパスはケバブケースを使用する

```
# 良い例
GET /api/users
GET /api/users/{id}
POST /api/users
GET /api/users/{id}/posts

# 悪い例
GET /api/getUsers
GET /api/user/{id}
POST /api/createUser
GET /api/userPosts/{id}
```

#### 4.1.2 HTTPメソッド
- 適切なHTTPメソッドを使用する
  - GET: リソースの取得
  - POST: リソースの作成
  - PUT: リソースの更新（全体）
  - PATCH: リソースの部分更新
  - DELETE: リソースの削除

#### 4.1.3 ステータスコード
- 適切なHTTPステータスコードを返す
  - 200: 成功
  - 201: 作成成功
  - 400: クライアントエラー
  - 401: 認証エラー
  - 403: 認可エラー
  - 404: リソースが見つからない
  - 500: サーバーエラー

#### 4.1.4 レスポンス形式
- 一貫したJSONレスポンス形式を使用する
- エラーレスポンスには適切なエラーコードとメッセージを含める

```json
// 成功レスポンスの例
{
  "status": "success",
  "data": {
    "id": "123",
    "name": "John Doe",
    "email": "john@example.com"
  }
}

// エラーレスポンスの例
{
  "status": "error",
  "error": {
    "code": "validation_error",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Email format is invalid"
      }
    ]
  }
}
```

## 5. プロトタイプ実装特有の規約

### 5.1 技術的負債の管理

- 意図的な技術的負債には明確なコメントを付け、将来の改善点を明記する
- 一時的な実装や回避策には「PROTOTYPE」または「HACK」マーカーを使用する
- リファクタリングが必要な箇所には「TODO」マーカーと簡単な説明を追加する

```javascript
// PROTOTYPE: モックデータを使用して応答時間をシミュレート
// TODO: 本実装では実際のAPIを呼び出すようにリファクタリングする
function fetchUsers() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(MOCK_USERS);
    }, 500);
  });
}

// HACK: このワークアラウンドは一時的なもので、
// バックエンドAPIが更新されたら削除する必要がある
function workaroundForApiInconsistency(data) {
  // 問題のあるコード
}
```

### 5.2 機能フラグ

- 未完成または実験的な機能はフィーチャーフラグで制御する
- フラグはアプリケーションの設定で一元管理する
- 非アクティブな機能のコードがメインフローに影響を与えないようにする

```javascript
// 機能フラグの定義
const FEATURES = {
  NEW_DASHBOARD: false,
  ADVANCED_SEARCH: true,
  EXPERIMENTAL_CHAT: false
};

// 機能フラグの使用
function Dashboard() {
  if (FEATURES.NEW_DASHBOARD) {
    return <NewDashboard />;
  }
  return <ClassicDashboard />;
}
```

### 5.3 設定と環境変数

- ハードコードされた値は避け、設定ファイルや環境変数を使用する
- 開発・テスト・本番環境で異なる可能性のある値は設定として抽出する
- 機密情報（API キー、パスワードなど）は環境変数として管理する

```javascript
// 設定の例
const config = {
  apiUrl: process.env.API_URL || 'https://api.dev.example.com',
  maxRetryAttempts: 3,
  defaultPageSize: 20,
  features: {
    newDashboard: process.env.FEATURE_NEW_DASHBOARD === 'true'
  }
};

// 環境変数の使用例
const apiClient = new ApiClient(process.env.API_KEY);
```

## 6. コードレビュー指針

### 6.1 レビューの焦点

プロトタイプ実装フェーズでのコードレビューでは、以下の点に特に注目します：

1. **機能的な正確さ** - 実装が要件を満たしているか
2. **コアロジックの堅牢性** - 主要なビジネスロジックが正確に実装されているか
3. **再利用可能性** - 共通コードが適切に抽出されているか
4. **拡張性** - 将来の変更や本実装へのスムーズな移行が可能か
5. **セキュリティの基本原則** - 明らかなセキュリティ問題がないか

プロトタイプフェーズでは、以下の点は厳密にはチェックしません：

1. パフォーマンスの最適化（明らかな問題を除く）
2. 完全なエラー処理とエッジケース
3. 広範なドキュメンテーション

### 6.2 レビューコメントの書き方

- 具体的で実用的なフィードバックを提供する
- 問題点だけでなく、改善案も提示する
- 主観的な好みではなく、標準やベストプラクティスに基づいてコメントする
- 批判的ではなく建設的なトーンを維持する

```
// 良いレビューコメントの例

// 具体的で改善案を含むコメント
このループは大きなデータセットで効率が悪くなる可能性があります。
考慮事項として、map()メソッドを使用すると可読性が向上し、将来の最適化も容易になります。

// 標準に基づくコメント
認証チェックがない状態でユーザーデータにアクセスしています。
セキュリティのベストプラクティスとして、このエンドポイントにも認証ミドルウェアを適用してください。
```

## 付録

### A. コードスニペットとベストプラクティス例

#### A.1 実用的なTypeScript型の例

```typescript
// よく使用される型の例
type ID = string | number;

// 関数の型定義
type Callback<T> = (data: T) => void;

// ユーティリティ型の活用
type Nullable<T> = T | null;
type Optional<T> = T | undefined;

// レスポンス型
interface ApiResponse<T> {
  status: 'success' | 'error';
  data?: T;
  error?: {
    code: string;
    message: string;
  };
}

// 条件付き型
type ExtractId<T> = T extends { id: infer U } ? U : never;
```

#### A.2 Reactのベストプラクティス

```jsx
// コンポーネント分割の例
function UserProfile({ user }) {
  return (
    <div className="user-profile">
      <UserAvatar user={user} />
      <UserInfo user={user} />
      <UserStats user={user} />
    </div>
  );
}

// メモ化の使用例
const MemoizedUserList = React.memo(function UserList({ users }) {
  return (
    <ul>
      {users.map(user => (
        <UserListItem key={user.id} user={user} />
      ))}
    </ul>
  );
});

// カスタムHookの例
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = value => {
    try {
      setStoredValue(value);
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue];
}
```

#### A.3 APIクライアントの例

```javascript
// APIクライアントの基本構造
class ApiClient {
  constructor(baseUrl, options = {}) {
    this.baseUrl = baseUrl;
    this.options = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    };
  }

  async get(endpoint, params = {}) {
    const url = new URL(`${this.baseUrl}${endpoint}`);
    Object.keys(params).forEach(key => {
      url.searchParams.append(key, params[key]);
    });
    
    try {
      const response = await fetch(url.toString(), {
        method: 'GET',
        ...this.options
      });
      
      return this._handleResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  async post(endpoint, data) {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: 'POST',
        ...this.options,
        body: JSON.stringify(data)
      });
      
      return this._handleResponse(response);
    } catch (error) {
      return this._handleError(error);
    }
  }

  // 他のメソッド (PUT, PATCH, DELETE) も同様に実装

  async _handleResponse(response) {
    const data = await response.json();
    
    if (!response.ok) {
      throw {
        status: response.status,
        data
      };
    }
    
    return data;
  }

  _handleError(error) {
    console.error('API request failed:', error);
    throw error;
  }
}
```

### B. ツールとリンター設定

#### B.1 ESLint設定例

```json
{
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module",
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "rules": {
    "indent": ["error", 2],
    "quotes": ["error", "single"],
    "semi": ["error", "always"],
    "no-console": ["warn", { "allow": ["warn", "error"] }],
    "react/prop-types": "off",
    "@typescript-eslint/explicit-function-return-type": "off",
    "@typescript-eslint/no-explicit-any": "warn"
  },
  "settings": {
    "react": {
      "version": "detect"
    }
  }
}
```

#### B.2 Prettierの設定例

```json
{
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "semi": true,
  "singleQuote": true,
  "trailingComma": "es5",
  "bracketSpacing": true,
  "jsxBracketSameLine": false,
  "arrowParens": "avoid"
}
```

### C. 参考資料

- [JavaScript Standard Style](https://standardjs.com/)
- [Google JavaScript Style Guide](https://google.github.io/styleguide/jsguide.html)
- [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- [TypeScript Deep Dive](https://basarat.gitbook.io/typescript/)
- [React Patterns](https://reactpatterns.com/)
- [Clean Code in JavaScript](https://github.com/ryanmcdermott/clean-code-javascript)

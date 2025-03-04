# リファクタリングパターン

## 概要
このドキュメントは、コードベースの品質向上、保守性向上、および拡張性の改善を目的としたリファクタリングパターンを提供します。実装フェーズでは、これらのパターンを適用して、技術的負債を減らし、コードの健全性を維持しましょう。

## リファクタリングの原則

### 1. リファクタリングのタイミング
- 新機能を追加する前
- バグを修正する前
- コードレビュー中に問題が指摘されたとき
- 繰り返しパターンや重複が発見されたとき
- 複雑性メトリクスが閾値を超えたとき

### 2. 安全なリファクタリング手法
- 小さな単位で変更を行う
- 各変更後にテストを実行する
- バージョン管理システムを活用し、頻繁にコミットする
- コミットメッセージに意図を明確に記述する
- リファクタリングと機能追加を別のコミットに分ける

### 3. リファクタリングの前提条件
- 適切なテストカバレッジの確保
- 明確なリファクタリングの目標設定
- チームメンバーへのリファクタリング意図の共有
- リファクタリング範囲と影響範囲の把握

## コードレベルのリファクタリングパターン

### 1. メソッド/関数の改善

#### 長すぎるメソッドの分割
**問題**:
- 単一の関数/メソッドが複数の責務を持っている
- 長さが40行を超える
- 理解しづらい処理の流れ

**解決策**:
- 単一責務の小さな関数に分割
- 意味のある関数名で処理内容を表現
- 関連する処理をグループ化

**例**:
```javascript
// リファクタリング前
function processOrder(order) {
  // 30+ 行の処理...
  // 入力検証、計算、データベース操作、通知送信など様々な処理
}

// リファクタリング後
function processOrder(order) {
  validateOrder(order);
  const totalAmount = calculateTotalAmount(order);
  saveOrderToDatabase(order, totalAmount);
  sendOrderConfirmation(order);
}
```

#### パラメータオブジェクトの導入
**問題**:
- メソッドのパラメータが多すぎる（4つ以上）
- 関連するパラメータが散在している

**解決策**:
- 関連するパラメータをオブジェクトにまとめる
- 名前付きパラメータで可読性を向上
- 必須パラメータとオプションパラメータを明確に分ける

**例**:
```typescript
// リファクタリング前
function createUser(name, email, age, address, phone, isActive, role) {
  // ...
}

// リファクタリング後
function createUser(userParams: {
  name: string,
  email: string,
  age: number,
  address?: string,
  phone?: string,
  isActive?: boolean,
  role?: string
}) {
  // ...
}
```

#### 条件分岐の簡略化
**問題**:
- ネストされた if 文
- 複雑な条件式
- 多くの else if ブロック

**解決策**:
- 早期リターンの導入
- 条件式の抽出とリファクタリング
- ポリモーフィズムや戦略パターンの検討

**例**:
```javascript
// リファクタリング前
function calculateDiscount(customer, order) {
  let discount = 0;
  if (customer.isPremium) {
    if (order.total > 100) {
      discount = 0.2;
    } else {
      discount = 0.1;
    }
  } else {
    if (order.total > 200) {
      discount = 0.1;
    } else {
      discount = 0.05;
    }
  }
  return discount;
}

// リファクタリング後
function calculateDiscount(customer, order) {
  if (customer.isPremium && order.total > 100) return 0.2;
  if (customer.isPremium) return 0.1;
  if (order.total > 200) return 0.1;
  return 0.05;
}
```

### 2. クラス/モジュールの改善

#### 過大なクラスの分割
**問題**:
- 単一のクラスが多すぎる責務を持っている
- クラスのメソッド数が多すぎる
- 関連性の低いフィールドやメソッドが混在

**解決策**:
- 単一責務の原則に基づいてクラスを分割
- 関連する機能を持つ小さなクラスへ再構成
- ヘルパークラスや特殊な目的のクラスを導入

**例**:
```typescript
// リファクタリング前
class UserManager {
  users = [];
  
  addUser(user) { /* ... */ }
  removeUser(userId) { /* ... */ }
  findUser(userId) { /* ... */ }
  
  saveToDatabase() { /* ... */ }
  loadFromDatabase() { /* ... */ }
  
  generateUserReport() { /* ... */ }
  exportToCsv() { /* ... */ }
  
  sendWelcomeEmail(user) { /* ... */ }
  sendPasswordReset(userId) { /* ... */ }
}

// リファクタリング後
class UserRepository {
  users = [];
  
  add(user) { /* ... */ }
  remove(userId) { /* ... */ }
  find(userId) { /* ... */ }
  
  saveToDatabase() { /* ... */ }
  loadFromDatabase() { /* ... */ }
}

class UserReportGenerator {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }
  
  generateReport() { /* ... */ }
  exportToCsv() { /* ... */ }
}

class UserNotificationService {
  sendWelcomeEmail(user) { /* ... */ }
  sendPasswordReset(userId) { /* ... */ }
}
```

#### 継承からコンポジションへの移行
**問題**:
- 深い継承階層
- 継承による強い結合
- 親クラスの変更が子クラスに予期せぬ影響を与える

**解決策**:
- 継承の代わりにコンポジションを使用
- インターフェースと実装を分離
- 委譲パターンの導入

**例**:
```typescript
// リファクタリング前
class Vehicle {
  start() { /* ... */ }
  stop() { /* ... */ }
}

class Car extends Vehicle {
  accelerate() { /* ... */ }
}

class ElectricCar extends Car {
  charge() { /* ... */ }
}

// リファクタリング後
interface Vehicle {
  start(): void;
  stop(): void;
}

class Engine {
  start() { /* ... */ }
  stop() { /* ... */ }
}

class Car implements Vehicle {
  constructor(private engine: Engine) {}
  
  start() { this.engine.start(); }
  stop() { this.engine.stop(); }
  accelerate() { /* ... */ }
}

class ElectricCar implements Vehicle {
  constructor(
    private engine: Engine,
    private battery: Battery
  ) {}
  
  start() { this.engine.start(); }
  stop() { this.engine.stop(); }
  accelerate() { /* ... */ }
  charge() { this.battery.charge(); }
}
```

#### データクラスからドメインモデルへの変換
**問題**:
- データのみを保持するクラス
- ビジネスロジックがサービスクラスに散在
- 低い求心性と高い結合度

**解決策**:
- 振る舞いをデータクラスに移動
- ドメインモデルの豊かさを高める
- サービスクラスから適切なメソッドを移動

**例**:
```typescript
// リファクタリング前
class Order {
  id: string;
  items: OrderItem[];
  customerId: string;
  status: string;
}

class OrderService {
  calculateTotal(order: Order): number { /* ... */ }
  canBeCancelled(order: Order): boolean { /* ... */ }
  cancel(order: Order): void { /* ... */ }
}

// リファクタリング後
class Order {
  id: string;
  items: OrderItem[];
  customerId: string;
  status: string;
  
  calculateTotal(): number { /* ... */ }
  canBeCancelled(): boolean { /* ... */ }
  cancel(): void { /* ... */ }
}
```

### 3. データ構造の改善

#### プリミティブ執着の排除
**問題**:
- 文字列や数値などのプリミティブ型の過度な使用
- 型情報の欠如による意味の不明瞭さ
- 関連するデータが分散

**解決策**:
- 意味を持つクラスや型を導入
- 値オブジェクトパターンの適用
- 強い型付けの活用

**例**:
```typescript
// リファクタリング前
function createReservation(name, startDate, endDate, roomNumber) {
  // startDate, endDate は文字列
  // ...
}

// リファクタリング後
class DateRange {
  constructor(public start: Date, public end: Date) {}
  
  durationInDays(): number { /* ... */ }
  overlaps(other: DateRange): boolean { /* ... */ }
}

class RoomNumber {
  constructor(public value: string) {
    if (!this.isValid(value)) {
      throw new Error('Invalid room number format');
    }
  }
  
  private isValid(value: string): boolean { /* ... */ }
}

function createReservation(name: string, dateRange: DateRange, roomNumber: RoomNumber) {
  // ...
}
```

#### コレクションのカプセル化
**問題**:
- コレクションが直接公開されている
- コレクション操作の一貫性がない
- ビジネスルールの分散

**解決策**:
- コレクションへのアクセスをカプセル化
- 明示的なコレクション操作メソッドの提供
- ビジネスルールの集中管理

**例**:
```typescript
// リファクタリング前
class Department {
  public employees: Employee[] = [];
}

// クライアントコード
const department = new Department();
department.employees.push(new Employee('John'));
department.employees.splice(0, 1); // 直接削除

// リファクタリング後
class Department {
  private _employees: Employee[] = [];
  
  addEmployee(employee: Employee): void {
    // ビジネスルールの検証
    if (this.hasReachedMaxCapacity()) {
      throw new Error('Department is at full capacity');
    }
    this._employees.push(employee);
  }
  
  removeEmployee(employee: Employee): void {
    const index = this._employees.indexOf(employee);
    if (index >= 0) {
      this._employees.splice(index, 1);
    }
  }
  
  getEmployees(): ReadonlyArray<Employee> {
    return [...this._employees]; // コピーを返して直接変更を防ぐ
  }
  
  private hasReachedMaxCapacity(): boolean { /* ... */ }
}
```

### 4. API 設計の改善

#### メソッドシグネチャの改善
**問題**:
- 一貫性のないメソッド命名
- 混在するコーディング規約
- 混乱を招くパラメータ順序

**解決策**:
- 一貫した命名規則の適用
- 意図を明確にするメソッド名の選択
- オプションオブジェクトの導入

**例**:
```typescript
// リファクタリング前
getUsers(); // 全ユーザー取得
fetchUserById(id); // IDでユーザー取得
retrieveUserWithName(name); // 名前でユーザー取得

// リファクタリング後
getUsers(); // 全ユーザー取得
getUserById(id); // IDでユーザー取得
getUserByName(name); // 名前でユーザー取得
```

#### ビルダーパターンの導入
**問題**:
- 複雑なオブジェクト構築プロセス
- 多数のコンストラクタパラメータ
- 柔軟性の欠如

**解決策**:
- ビルダーパターンの導入
- 段階的なオブジェクト構築
- メソッドチェーンの活用

**例**:
```typescript
// リファクタリング前
const query = new SearchQuery(
  'keyword',
  ['title', 'content'],
  10,
  0,
  true,
  'relevance',
  'desc',
  true,
  false
);

// リファクタリング後
const query = new SearchQueryBuilder()
  .withKeyword('keyword')
  .inFields(['title', 'content'])
  .withLimit(10)
  .withOffset(0)
  .includeDrafts(true)
  .sortBy('relevance')
  .sortDirection('desc')
  .enableHighlighting(true)
  .enableFaceting(false)
  .build();
```

## アーキテクチャレベルのリファクタリングパターン

### 1. レイヤー分離の改善

#### 適切な抽象化レベルの導入
**問題**:
- 異なる抽象化レベルのコードが混在
- ビジネスロジックと技術的実装の混在
- コードの再利用性の低さ

**解決策**:
- 明確なレイヤー分けの導入
- インターフェースによる依存関係の逆転
- 単一責務の原則の徹底

**例**:
```typescript
// リファクタリング前 - 混在したコード
class UserService {
  async createUser(userData) {
    // バリデーション
    if (!userData.email || !userData.password) {
      throw new Error('Invalid user data');
    }
    
    // パスワードハッシュ化
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    
    // データベース操作
    const db = await mongodb.connect('mongodb://localhost:27017');
    const result = await db.collection('users').insertOne({
      ...userData,
      password: hashedPassword
    });
    
    // メール送信
    const transporter = nodemailer.createTransport({ /* ... */ });
    await transporter.sendMail({
      to: userData.email,
      subject: 'Welcome!',
      text: 'Thank you for registering.'
    });
    
    return result.insertedId;
  }
}

// リファクタリング後 - レイヤー分離
interface UserRepository {
  save(user: User): Promise<string>;
}

interface EmailService {
  sendWelcomeEmail(email: string): Promise<void>;
}

class UserService {
  constructor(
    private userRepository: UserRepository,
    private emailService: EmailService,
    private passwordHasher: PasswordHasher
  ) {}
  
  async createUser(userData: UserCreationDto): Promise<string> {
    this.validateUserData(userData);
    
    const user = new User({
      ...userData,
      password: await this.passwordHasher.hash(userData.password)
    });
    
    const userId = await this.userRepository.save(user);
    await this.emailService.sendWelcomeEmail(user.email);
    
    return userId;
  }
  
  private validateUserData(data: UserCreationDto): void {
    // バリデーションロジック
  }
}
```

#### 疎結合への移行
**問題**:
- コンポーネント間の強い結合
- テストの難しさ
- 変更の影響範囲が広い

**解決策**:
- 依存性注入の導入
- インターフェースベースのプログラミング
- イベント駆動アーキテクチャの検討

**例**:
```typescript
// リファクタリング前 - 強い結合
class OrderProcessor {
  private paymentGateway = new PayPalGateway();
  private inventoryManager = new InventoryManager();
  
  processOrder(order) {
    // 直接依存しているクラスを使用
    this.paymentGateway.processPayment(order);
    this.inventoryManager.updateStock(order);
  }
}

// リファクタリング後 - 疎結合
interface PaymentGateway {
  processPayment(order: Order): Promise<PaymentResult>;
}

interface InventoryService {
  updateStock(order: Order): Promise<void>;
}

class OrderProcessor {
  constructor(
    private paymentGateway: PaymentGateway,
    private inventoryService: InventoryService
  ) {}
  
  async processOrder(order: Order): Promise<void> {
    await this.paymentGateway.processPayment(order);
    await this.inventoryService.updateStock(order);
  }
}
```

### 2. ビジネスロジックの改善

#### ドメイン駆動設計パターンの導入
**問題**:
- 貧血ドメインモデル
- ビジネスロジックの散在
- 概念の不明確な表現

**解決策**:
- 豊かなドメインモデルの導入
- 集約、エンティティ、値オブジェクトの明確化
- ユビキタス言語の採用

**例**:
```typescript
// リファクタリング前 - 貧血モデル
class Order {
  id: string;
  customerId: string;
  items: { productId: string, quantity: number }[];
  status: string;
}

class OrderService {
  placeOrder(order: Order): void {
    // ビジネスロジック
  }
  
  cancelOrder(orderId: string): void {
    // ビジネスロジック
  }
}

// リファクタリング後 - 豊かなドメインモデル
class OrderItem {
  constructor(
    public readonly productId: string,
    public quantity: number,
    public readonly unitPrice: Money
  ) {
    if (quantity <= 0) {
      throw new Error('Quantity must be positive');
    }
  }
  
  getSubtotal(): Money {
    return this.unitPrice.multiply(this.quantity);
  }
}

class Order {
  private readonly id: OrderId;
  private readonly customerId: CustomerId;
  private readonly items: OrderItem[] = [];
  private status: OrderStatus = OrderStatus.DRAFT;
  
  addItem(item: OrderItem): void {
    if (this.status !== OrderStatus.DRAFT) {
      throw new OrderOperationError('Cannot modify a confirmed order');
    }
    this.items.push(item);
  }
  
  place(): void {
    if (this.items.length === 0) {
      throw new OrderOperationError('Cannot place an empty order');
    }
    this.status = OrderStatus.PLACED;
    // ドメインイベント発行
    DomainEvents.publish(new OrderPlacedEvent(this.id));
  }
  
  cancel(): void {
    if (this.status !== OrderStatus.PLACED) {
      throw new OrderOperationError('Only placed orders can be cancelled');
    }
    this.status = OrderStatus.CANCELLED;
    // ドメインイベント発行
    DomainEvents.publish(new OrderCancelledEvent(this.id));
  }
  
  getTotalAmount(): Money {
    return this.items.reduce(
      (total, item) => total.add(item.getSubtotal()),
      Money.zero()
    );
  }
}
```

### 3. 技術的負債の削減

#### 重複コードの排除
**問題**:
- 同様のコードが複数箇所に存在
- バグ修正時の漏れ
- コードベースサイズの増大

**解決策**:
- 共通機能の抽出
- ヘルパー関数やユーティリティクラスの導入
- 共有ライブラリの作成

**例**:
```typescript
// リファクタリング前 - 重複コード
class UserService {
  validateEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
}

class RegisterController {
  validateEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
}

// リファクタリング後 - 共通コード
class EmailValidator {
  static isValid(email: string): boolean {
    const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return regex.test(email);
  }
}

class UserService {
  validateEmail(email: string): boolean {
    return EmailValidator.isValid(email);
  }
}

class RegisterController {
  validateEmail(email: string): boolean {
    return EmailValidator.isValid(email);
  }
}
```

#### レガシーコードの段階的改善
**問題**:
- 古いコードベースの保守が困難
- テストカバレッジの不足
- 現代的なプラクティスの欠如

**解決策**:
- ストレングラーフィグパターンの適用
- テストの事後追加
- 段階的なリファクタリング

**例**:
```typescript
// リファクタリング戦略

// 1. 既存コードを分離
// old-legacy-module.js をそのまま残す

// 2. 新しいモジュールを作成
// new-module.ts

// 3. アダプターの作成
class LegacyAdapter {
  adaptLegacyToNew(legacyData): NewData {
    // 変換ロジック
  }
  
  adaptNewToLegacy(newData): LegacyData {
    // 変換ロジック
  }
}

// 4. 段階的な移行
// client.js
if (featureFlags.useNewImplementation) {
  // 新しい実装を使用
  const result = newModule.process(data);
} else {
  // レガシーコードを使用
  const result = oldLegacyModule.process(data);
}

// 5. テストの追加
// test/new-module.test.ts
```

## リファクタリングの評価と計測

### 1. リファクタリング成功の指標
- 静的解析ツールのメトリクス改善
- サイクロマチック複雑性の低下
- 結合度の低下と凝集度の向上
- テストカバレッジの増加
- ビルド時間やテスト実行時間の短縮

### 2. リファクタリングの ROI 計算
- リファクタリング前後の開発速度比較
- バグ報告数の変化
- 新機能追加にかかる時間の変化
- チームの生産性指標

### 3. リファクタリングの副作用の監視
- パフォーマンスへの影響
- メモリ使用量の変化
- システムの安定性
- ユーザー体験への影響

## リファクタリングワークフローの確立

### 1. リファクタリングのプロセス
1. **問題の特定**:
   - 静的解析ツールの活用
   - コードレビューからのフィードバック
   - パフォーマンスプロファイリング

2. **計画作成**:
   - リファクタリングの範囲を明確に定義
   - リスクと影響の評価
   - タスクの優先順位付け

3. **テスト戦略**:
   - 既存テストの確認
   - 不足しているテストの追加
   - リグレッションテストの準備

4. **実装**:
   - 段階的な変更
   - 頻繁なコミット
   - 継続的なテスト実行

5. **検証**:
   - すべてのテストの実行
   - コードレビュー
   - 静的解析の実行

6. **リリース**:
   - デプロイ計画
   - モニタリング設定
   - ロールバック戦略

### 2. リファクタリングの優先順位付け
- **高**: セキュリティリスクを含むコード、頻繁に変更される領域
- **中**: パフォーマンスボトルネック、保守が難しい領域
- **低**: あまり変更されない安定した領域

### 3. リファクタリングのドキュメント化
- リファクタリングの理由と目標
- 変更の概要と影響範囲
- 採用したパターンとテクニック
- 得られた教訓

## まとめ
リファクタリングはソフトウェア開発の継続的な側面であり、コードベースの健全性維持に不可欠です。計画的かつ段階的なリファクタリングを通じて、技術的負債を減らし、開発速度と品質を向上させることができます。このドキュメントで示したパターンと手法を活用して、継続的な改善の文化を育てましょう。 

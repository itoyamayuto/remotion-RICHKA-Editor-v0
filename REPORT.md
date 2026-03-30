# RICHKA Editor — プロジェクト報告書

## 1. ツールの目的

RICHKA Editorは、**動画制作の専門知識がないユーザーでも、テンプレートを選んでテキスト・画像を入力するだけで15秒の動画広告を作成・書き出しできるWebツール**です。

日本の動画広告市場向けに設計されており、SNS広告（TikTok、Instagram、YouTube等）やWeb広告に使える動画を、デザイナーや動画編集者に依頼することなく、社内で素早く量産することを目的としています。

### 想定ユーザー
- マーケティング担当者
- 広告運用者
- SNS運用担当者
- 動画制作の経験がない初心者

### 解決する課題
| 課題 | RICHKA Editorでの解決 |
|------|----------------------|
| 動画制作に時間とコストがかかる | テンプレート選択＋テキスト入力で数分で完成 |
| 専門ソフト（After Effects等）が必要 | ブラウザだけで完結 |
| 複数サイズの動画が必要 | 9:16 / 1:1 / 16:9 をワンクリック切替 |
| デザインの統一が難しい | トーン（カラーテーマ）でブランド統一 |

---

## 2. 機能・仕様一覧

### 2.1 テンプレート（10種類）

| No. | テンプレート名 | カテゴリ | 用途 | シーン数 | 入力数 |
|-----|---------------|---------|------|---------|--------|
| 01 | 商品紹介（シンプル） | 商品紹介 | 商品・サービスの基本紹介 | 5 | 8 |
| 02 | セール・キャンペーン告知 | セール | 期間限定セール・割引告知 | 5 | 7 |
| 03 | アプリ紹介 | アプリ | アプリDL促進 | 5 | 7 |
| 04 | ビフォーアフター | 比較 | 使用前後の変化訴求 | 5 | 8 |
| 05 | 問題提起→解決型 | 訴求 | 課題→解決策の提示 | 5 | 7 |
| 06 | テスティモニアル（口コミ） | 口コミ | ユーザーレビュー活用 | 5 | 8 |
| 07 | ランキング・比較 | 比較 | ランキング形式で優位性アピール | 5 | 7 |
| 08 | ストーリーテリング | ストーリー | 物語形式で共感を生む | 5 | 7 |
| 09 | カウントダウン・限定訴求 | 緊急 | 緊急性・限定感で行動促進 | 5 | 6 |
| 10 | ブランド認知（イメージ重視） | ブランド | ブランドイメージの訴求 | 5 | 7 |

### 2.2 アスペクト比（3パターン）

| 比率 | 解像度 | 主な用途 |
|------|--------|---------|
| 9:16（縦型） | 1080×1920 | TikTok / Instagram Stories / YouTube Shorts |
| 1:1（正方形） | 1080×1080 | Instagram投稿 / Facebook広告 |
| 16:9（横型） | 1920×1080 | YouTube / Web広告 / ディスプレイ広告 |

### 2.3 カラートーン（6種類）

| トーン名 | 印象 | 主な用途 |
|---------|------|---------|
| 信頼・プロフェッショナル | 紺×ゴールド | BtoB、金融、不動産 |
| ポップ・エネルギッシュ | ピンク×イエロー | 若年層向け、EC |
| ブランドカラー | オレンジ×ネイビー | ブランド訴求全般 |
| ナチュラル・オーガニック | グリーン×ベージュ | 美容、健康、食品 |
| テック・先進的 | パープル×ブルー | IT、SaaS、アプリ |
| ラグジュアリー・高級 | ゴールド×ブラック | 高級ブランド、ジュエリー |

### 2.4 BGM（10種類）

| No. | BGM名 | ムード |
|-----|-------|--------|
| 01 | コーポレート | ビジネス・企業向け |
| 02 | アップビート | 明るく前向き |
| 03 | エモーショナル | 感動的・ドラマチック |
| 04 | テクノ | デジタル・先進的 |
| 05 | エレガント | 上品・高級感 |
| 06 | エナジェティック | 勢いのある |
| 07 | カーム | 落ち着いた・穏やか |
| 08 | ドラマティック | 壮大・迫力 |
| 09 | プレイフル | 楽しい・遊び心 |
| 10 | シネマティック | 映画的・格調高い |

### 2.5 その他の機能

- **画像アップロード**: テンプレートが必要とする枚数分アップロード可能（1〜3枚）
- **ロゴ挿入**: ブランドロゴを任意でアップロード・動画に挿入
- **効果音（SFX）**: ON/OFFの切り替え可能
- **リアルタイムプレビュー**: Remotion Playerによる入力内容の即時反映
- **MP4書き出し**: H.264コーデックでのMP4ファイル生成・ダウンロード
- **バリデーション**: 必須項目の入力チェック・文字数制限

### 2.6 動画仕様

| 項目 | 値 |
|------|-----|
| 尺 | 15秒 |
| フレームレート | 30fps |
| 総フレーム数 | 450フレーム |
| コーデック | H.264 |
| フォーマット | MP4 |

---

## 3. 技術スタック

| 技術 | 役割 |
|------|------|
| **Remotion** | 動画のレンダリングエンジン（React → MP4） |
| **React 19** | UIフレームワーク |
| **TypeScript** | 型安全な開発 |
| **Vite** | エディタUIのビルドツール |
| **Zustand** | 状態管理（テンプレート選択、入力値、設定） |
| **Express** | 書き出し用レンダーサーバー |
| **Tailwind CSS 4** | スタイリング |
| **Zod** | 入力バリデーション |

---

## 4. 開発フロー

### Phase 1: 基盤構築
1. Remotionプロジェクトの初期セットアップ
2. TypeScript型定義の設計（`types.ts`）
3. テンプレートレジストリ（`registry.ts`）の設計
4. アスペクト比・トーン・BGMのデータ定義

### Phase 2: テンプレート制作（10本）
1. 共通アニメーションコンポーネントの作成（`AnimatedText`, `GradientBackground`, `SceneWrapper`等）
2. テンプレート01〜10の実装（各5シーン構成）
3. 各テンプレートのアスペクト比対応（レスポンシブレイアウト）

### Phase 3: エディタUI構築
1. テンプレート選択画面の実装
2. サイドバー型エディタ画面の実装
3. Remotion Playerによるリアルタイムプレビュー統合
4. 画像アップロード機能（単一・複数対応）
5. BGMセレクター・トーンセレクターの実装

### Phase 4: 書き出し機能
1. Expressベースのレンダーサーバー構築
2. Remotion `renderMedia` APIとの統合
3. 画像ファイルのサーバー転送・public/パスへの変換
4. プログレスバー付きExportDialogの実装
5. MP4ダウンロード機能

### Phase 5: UX改善・デザインリファイン
1. ダークテーマ → ライトテーマへの全面切り替え
2. フォーカス状態・キーボードナビゲーション対応
3. ステップインジケーターの追加
4. セクション折りたたみ機能
5. 入力バリデーション・フィードバック強化
6. トースト通知システム
7. ページ遷移アニメーション
8. 初心者フレンドリーなデザインへの調整

### Phase 6: 素材整備
1. フリーBGM素材（10曲）の配置
2. 効果音（SFX）素材の配置
3. 日本語フォント（Noto Sans JP）の統合

---

## 5. プロジェクト構成（ディレクトリ）

```
remotion-RICHKA-Editor-v0/
├── public/                          # 静的ファイル
│   ├── audio/
│   │   ├── bgm/                     # BGM 10曲（MP3）
│   │   │   ├── bgm-01-corporate.mp3
│   │   │   ├── bgm-02-upbeat.mp3
│   │   │   └── ... (計10ファイル)
│   │   └── sfx/                     # 効果音（WAV）
│   │       ├── chime.wav
│   │       ├── pop.wav
│   │       ├── sparkle.wav
│   │       └── whoosh.wav
│   └── fonts/                       # フォントファイル
│
├── src/
│   ├── editor/                      # エディタUI（Viteアプリ）
│   │   ├── App.tsx                  # ルートコンポーネント
│   │   ├── store.ts                 # Zustand状態管理
│   │   ├── globals.css              # グローバルスタイル・CSS変数
│   │   ├── pages/
│   │   │   ├── TemplateSelectPage.tsx  # テンプレート選択画面
│   │   │   └── EditorPage.tsx          # 編集画面
│   │   ├── components/
│   │   │   ├── editor/
│   │   │   │   ├── InputForm.tsx           # テキスト入力フォーム
│   │   │   │   ├── ImageUploadInput.tsx    # 画像アップロード（単一）
│   │   │   │   ├── MultiImageUploadInput.tsx # 画像アップロード（複数）
│   │   │   │   ├── ToneSelector.tsx        # カラートーン選択
│   │   │   │   ├── BGMSelector.tsx         # BGM選択
│   │   │   │   ├── LogoUploadInput.tsx     # ロゴアップロード
│   │   │   │   └── PreviewPanel.tsx        # プレビューパネル
│   │   │   ├── export/
│   │   │   │   └── ExportDialog.tsx        # 書き出しダイアログ
│   │   │   ├── template-select/
│   │   │   │   ├── TemplateCard.tsx        # テンプレートカード
│   │   │   │   ├── TemplateGrid.tsx        # テンプレート一覧グリッド
│   │   │   │   └── AspectRatioSelector.tsx # アスペクト比選択
│   │   │   └── Toast.tsx                   # トースト通知
│   │   └── entry-editor.tsx         # Viteエントリーポイント
│   │
│   ├── remotion/                    # Remotion動画エンジン
│   │   ├── types.ts                 # 型定義（テンプレート、トーン、比率等）
│   │   ├── aspectRatios.ts          # アスペクト比定義（3パターン）
│   │   ├── tones.ts                 # カラートーン定義（6パターン）
│   │   ├── animations.ts            # 共通アニメーション関数
│   │   └── components/              # 共通動画コンポーネント
│   │       ├── AnimatedText.tsx      # テキストアニメーション
│   │       ├── GradientBackground.tsx # グラデーション背景
│   │       ├── SceneWrapper.tsx      # シーン切り替えラッパー
│   │       ├── CTAButton.tsx         # CTAボタン
│   │       ├── ImageWithEffect.tsx   # 画像エフェクト
│   │       ├── LogoReveal.tsx        # ロゴ登場演出
│   │       ├── ParticleOverlay.tsx   # パーティクル
│   │       ├── CountdownTimer.tsx    # カウントダウン
│   │       ├── StatCounter.tsx       # 数値カウントアップ
│   │       ├── ReviewCard.tsx        # レビューカード
│   │       ├── RankingBar.tsx        # ランキングバー
│   │       ├── BeforeAfterSplit.tsx  # ビフォーアフター分割
│   │       └── TrustBadge.tsx        # トラストバッジ
│   │
│   ├── templates/                   # テンプレート本体
│   │   ├── registry.ts              # テンプレートメタデータ・BGM定義
│   │   ├── Template01_ProductIntro.tsx
│   │   ├── Template02_SaleCampaign.tsx
│   │   ├── Template03_AppIntro.tsx
│   │   ├── Template04_BeforeAfter.tsx
│   │   ├── Template05_ProblemSolution.tsx
│   │   ├── Template06_Testimonial.tsx
│   │   ├── Template07_Ranking.tsx
│   │   ├── Template08_Storytelling.tsx
│   │   ├── Template09_Countdown.tsx
│   │   └── Template10_BrandAwareness.tsx
│   │
│   ├── render/                      # 書き出しサーバー
│   │   ├── server.ts                # Express APIサーバー
│   │   └── render-video.ts          # CLI用レンダリングスクリプト
│   │
│   ├── Root.tsx                     # Remotion Composition登録
│   └── index.ts                     # Remotionエントリー
│
├── package.json                     # 依存関係・スクリプト
├── tsconfig.json                    # TypeScript設定
├── vite.config.ts                   # Vite設定
├── remotion.config.ts               # Remotion設定
└── REPORT.md                        # 本報告書
```

---

## 6. 主要ファイルの役割

### 型定義（src/remotion/types.ts）
全体で共有する型を定義。テンプレートのメタデータ、入力フィールド、トーン、アスペクト比、BGMオプション等の型。

### テンプレートレジストリ（src/templates/registry.ts）
全10テンプレートのメタデータ（名前、説明、カテゴリ、入力フィールド定義）とBGM10曲の定義を一元管理。テンプレート追加時はここにメタデータを追加し、対応するコンポーネントを作成する。

### 状態管理（src/editor/store.ts）
Zustandによるグローバル状態。選択中のテンプレートID、アスペクト比、トーン、全入力値、BGM選択、エクスポート進捗等を管理。

### レンダーサーバー（src/render/server.ts）
`/api/render` エンドポイントを提供。フロントエンドから入力データを受け取り、Remotionの `bundle()` → `renderMedia()` を実行してMP4を生成。進捗状況をレスポンスに含める。

---

## 7. 起動方法

```bash
# エディタUI（メイン画面）
npm run editor
# → http://localhost:3000

# 書き出しサーバー（書き出し時に必要）
RENDER_PORT=3002 npm run render:server
# → http://localhost:3002

# Remotion Studio（テンプレート開発用）
npm run dev
```

---

## 8. 今後の拡張可能性

- テンプレートの追加（レジストリに登録するだけで拡張可能）
- 動画尺のバリエーション（6秒 / 30秒 / 60秒）
- ユーザー認証・保存機能
- テンプレートプレビューのサムネイル画像
- AIによるコピー自動生成
- バッチ書き出し（複数バリエーション一括生成）
- クラウドレンダリング（AWS Lambda / GCP Cloud Run）

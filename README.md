# BrainChallenge

脳トレゲーム。  
[BraninChallenge](https://c-jacknon.github.io/brain-challenge/)

## 開発手順

特定のブランチを落とす。  
`git clone https://github.com/C-JACKnon/brain-challenge.git`

`feature/{開発内容}`の形式で開発用ブランチを作成する。  
※checkoutも忘れずに。

開発用サーバを起動する。  
`npm start`

起動した画面を確認する。  
[http://localhost:4200/](http://localhost:4200/)

実装をコミットする。  
⇒ [コミットルール](##コミットルール)参照。

mainブランチへマージする。

mainブランチで以下のコマンドを実行し、デプロイする。  
`npm run deploy`  
⇒ [gh-pagesブランチ](https://github.com/C-JACKnon/brain-challenge/commits/gh-pages/)へコミットされる。

mainブランチとgh-pagesブランチにtagを付ける。
* main: X.Y.Z
* gh-pages: release_X.Y.Z

## コミットルール

* コミットメッセージが短くなるようにコミットは細かく行うこと。
* なるべく複数の変更を一つのコミットにせず、分けてコミットすること。
* 以下の形式でコミットメッセージを記載すること。  
`[{画面名}] {変更内容}`  
例）[Make10] 演算で無限になってしまう不具合修正  
※ただし全体に影響する場合は[Overall]とする。


## ブランチ運用

* mainブランチをリリースブランチとして扱う。
* 機能開発やバグ修正は、必ず`feature/{開発内容}`ブランチで行うこと。
* mainブランチへのマージ後にtag付けを行うこと。  
tagはX.Y.Z記法で行う。  
X: メジャーバージョン デザインや操作性等の大きな変更  
Y: 機能向上や部分的な修正
Z: バグ修正や細やかな修正
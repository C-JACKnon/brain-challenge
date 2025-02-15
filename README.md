# BrainChallenge

脳トレゲーム。  
[BraninChallenge](https://c-jacknon.github.io/brain-challenge/)

## 開発手順

特定のブランチを落とす。  
`git clone https://github.com/C-JACKnon/brain-challenge.git`

開発用サーバを起動する。  
`npm start`

起動した画面を確認する。  
[http://localhost:4200/](http://localhost:4200/)

製品としてビルドする。  
`npm run build`  
⇒ distフォルダ下にビルドしたファイルが配置される。

## コミットルール

* コミットメッセージが短くなるようにコミットは細かく行うこと。
* なるべく複数の変更を一つのコミットにせず、分けてコミットすること。
* 以下の形式でコミットメッセージを記載すること。  
`[{画面名}] {変更内容}`  
例）[Make10] 演算で無限になってしまう不具合修正  
※ただし全体に影響する場合は[Overall]とする。


## ブランチ運用

* mainブランチをリリースブランチとして扱う。
* 機能開発やバグ修正を行う場合は、`feature/{内容}`ブランチを作成すること。
* mainブランチへマージを行う場合、必ず以下のコマンドで製品ビルドを行うこと。  
`npm run build`
* mainブランチへのマージ後にtag付けを行うこと。  
tagはX.Y.Z記法で行う。  
X: メジャーバージョン デザインや操作性等の大きな変更  
Y: 機能向上や部分的な修正
Z: バグ修正や細やかな修正
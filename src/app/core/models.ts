import { HttpStatusCode } from "@angular/common/http";

/**
 * プレイヤー情報
 */
export type PlayerInfo = {
  id: string,
  name: string,
  score: number,
}

/**
 * 今日のスコア
 */
export type TodayScore = {
  date: string, // scoreの日付(yyyy/M/d)
  score: number[], // 今日のスコアの1位から10位まで
}

/**
 * リザルトダイアログ用のデータ
 */
export type ResultDialogData = {
  score: number // 表示するスコア
};

/** HTTP通信結果 **/
/**
 * HTTP通信の応答規定
 */
interface HttpResponseBase {
  status: HttpStatusCode, // HTTPステータスコード
  message: string, // 成功時: OK、失敗時: エラーメッセージ
}
/**
 * オンラインスコア取得通信のレスポンス
 */
export interface GetOnlineScoreResponse extends HttpResponseBase {
  ranking: PlayerInfo[],
}

/**
 * スコア登録通信のレスポンス
 */
export interface PostScoreResponse extends HttpResponseBase { }
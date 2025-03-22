import { HttpStatusCode } from "@angular/common/http";

/**
 * 取得するオンラインスコア
 */
export type OnlineScore = {
  date: string,
  ranking: PlayerInfo[],
}

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

/**
 * NGワード
 */
export type NgWordListType = {
  hira: string[], // ひらがな
  kan: string[], // 漢字
  kata: string[], // カタカナ
  hankaku: string[], // 半角カタカナ
  mix: string[], // ひらがな、漢字、カタカナ混合
  roma: string[], // ローマ字
  en: string[], // 英語
  num: string[], // 数字
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
  rankingList: OnlineScore[],
}

/**
 * スコア登録通信のレスポンス
 */
export interface PostScoreResponse extends HttpResponseBase { }
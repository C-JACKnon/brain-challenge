import { Injectable } from '@angular/core';

/**
 * Make10用の通知サービス
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class MakeTenNotificationService {
  private giveUpAnswer: string = ''; // ギブアップ時に表示する答え(非表示の場合は空文字)
  private scoreTime: number = 0; // 全問正解時に表示するタイム(非表示の場合は0)

  /**
   * ギブアップ時に表示する答えを取得する
   * @returns ギブアップ時に表示する答え（非表示の場合には空文字を返す）
   */
  public getGiveUpAnswer(): string {
    const giveUpAnswer = this.giveUpAnswer;
    this.giveUpAnswer = '';
    return giveUpAnswer;
  }

  /**
   * ギブアップ時に表示する答えを設定する
   * @param answer 答え
   */
  public setGiveUpAnswer(answer: string): void {
    this.giveUpAnswer = answer;
  }

  /**
   * 全問正解時に表示するタイムを取得する
   * @returns 全問正解時に表示するタイム（非表示の場合には0を返す）
   */
  public getScoreTime(): number {
    const scoreTime = this.scoreTime;
    this.scoreTime = 0;
    return scoreTime;
  }

  /**
   * 全問正解時に表示するタイムを設定する
   * @param time タイム
   */
  public setScoreTime(time: number): void {
    this.scoreTime = time;
  }
}

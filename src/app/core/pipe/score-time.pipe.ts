import { Pipe, PipeTransform } from '@angular/core';
import { MaxTime } from '../constants';

@Pipe({
  name: 'scoreTime',
  standalone: true
})
export class ScoreTimePipe implements PipeTransform {
  private readonly TimeLimitOverText: string = '記録なし';

  /**
   * 値の変換
   * @param value 入力値
   * @returns 変換後の値
   */
  public transform(value: number): string {
    let scoreTime = '';
    if (value > MaxTime) {
      scoreTime = this.TimeLimitOverText;
    }
    else {
      let formatTime: number = Math.trunc(value / 10); // 不要な1桁目を切り捨て
      const decimal: number = formatTime % 100; // 小数部
      formatTime = Math.trunc(formatTime / 100); // 秒のみに変換
      const minute: number = Math.trunc(formatTime / 60); // 分部
      const second: number = formatTime % 60; // 秒部
      const formatTimeString: string = this.zeroPadding(minute, 2)
        + ':' + this.zeroPadding(second, 2)
        + '.' + this.zeroPadding(decimal, 2);
      scoreTime = formatTimeString;
    }
    return scoreTime;
  }

  /**
   * ゼロパディング処理
   * @param targetValue 処理を行う数字
   * @param digits ゼロ埋めで合わせる桁数 (3桁まで)
   * @returns ゼロパディング処理後の文字列
   */
  private zeroPadding(targetValue: number, digits: number): string {
    const value: string = String(targetValue);
    if (value.length >= digits) {
      return value;
    }

    let formatValue = '00' + value;
    return formatValue.slice(-digits);
  }
}

import { Directive, ElementRef, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MaxTime } from '../constants';

/**
 * タイムを整形するディレクティブ
 * @directive
 */
@Directive({
  selector: '[appTimeFormat]',
  standalone: true
})
export class TimeFormatDirective implements OnChanges {
  private readonly TimeLimitOverText: string = '記録なし';

  @Input() public time: number = 0; // タイム (ms)

  /**
   * コンストラクタ
   * @constructor
   */
  constructor(private elementRef: ElementRef) { }

  /**
   * ライフサイクル: 値の変更
   * @param changes 変更内容
   */
  public ngOnChanges(changes: SimpleChanges): void {
    this.elementRef.nativeElement.innerText = this.formatTime(changes['time'].currentValue);
  }

  /**
   * タイムを{00:00.00}の形式に整形した文字列に変換する
   * @param time タイム
   * @returns 整形したタイムの文字列
   */
  private formatTime(time: number): string {
    if (time >= MaxTime) {
      return this.TimeLimitOverText;
    }

    let formatTime: number = Math.trunc(time / 10); // 不要な1桁目を切り捨て
    const decimal: number = formatTime % 100; // 小数部
    formatTime = Math.trunc(formatTime / 100); // 秒のみに変換
    const minute: number = Math.trunc(formatTime / 60); // 分部
    const second: number = formatTime % 60; // 秒部
    const formatTimeString: string = this.zeroPadding(minute, 2)
      + ':' + this.zeroPadding(second, 2)
      + '.' + this.zeroPadding(decimal, 2);
    return formatTimeString;
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

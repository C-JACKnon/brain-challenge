import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TimeFormatDirective } from '../../../core/directive/time-format.directive';
import { MaxTime } from '../../../core/constants';
import { SQUARE_BUTTON_COLOR, SquareButtonComponent } from "../../share/square-button/square-button.component";

/**
 * Make10画面コンポーネント
 * @class
 */
@Component({
  selector: 'app-make-ten',
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    TimeFormatDirective,
    SquareButtonComponent
],
  templateUrl: './make-ten.component.html',
  styleUrl: './make-ten.component.scss'
})
export class MakeTenComponent {
  public readonly SquareButtonColor = SQUARE_BUTTON_COLOR;
  private readonly MaxQuestionCount: number = 5; // 最大問題数

  public questionCounter: number = 1; // 現在の問題数
  public time: number = 0; // 経過時間 (ms)
  private timerId: number = 0; // タイマー停止用のID

  // TODO: 動作確認のため追加
  private isTimerRunning: boolean = false;

  /**
   * 白旗ボタンクリックイベント
   */
  public onClickFlagButton(): void {
    // TODO: ダイアログ表示

    // TOOD: 動作確認のため追加
    this.questionCounter++;
    if (this.questionCounter > this.MaxQuestionCount) {
      this.questionCounter = 1;
    }

    // TODO: 動作確認のため追加
    if (this.isTimerRunning) {
      this.stopTImer();
    }
    else {
      this.startTimer();
    }
    this.isTimerRunning = !this.isTimerRunning;
  }

  /**
   * リセットボタンクリックイベント
   */
  public onClickResetButton(): void {
    console.log('Clicked RESET button.') // TODO: 動作確認のため追加
  }

  /**
   * タイマーをスタートさせる
   */
  private startTimer(): void {
    if (this.time >= MaxTime) {
      return;
    }

    const startTime: number = Date.now() - this.time;
    this.timerId = window.setInterval(() => {
      this.time = Date.now() - startTime;
      if (this.time >= MaxTime) {
        this.stopTImer();
      }
    }, 1);
  }

  /**
   * タイマーをストップさせる
   */
  private stopTImer(): void {
    window.clearInterval(this.timerId);
  }
}

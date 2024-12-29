import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TimeFormatDirective } from '../../../core/directive/time-format.directive';
import { MaxTime } from '../../../core/constants';
import { SQUARE_BUTTON_COLOR, SquareButtonComponent } from "../../share/square-button/square-button.component";
import { CIRCLE_BUTTON_COLOR, CircleButtonComponent } from "./unique-components/circle-button/circle-button.component";
import { DisplaySizeManagementService } from '../../../core/services/display-size-management.service';
import { Subject, takeUntil } from 'rxjs';

/**
 * 丸ボタンの種類
 */
export enum CIRCLE_BUTTON_TYPE {
  NUMBER_FIRST,   // 1つ目の数字
  NUMBER_SECOND,  // 2つ目の数字
  NUMBER_THIRD,   // 3つ目の数字
  NUMBER_FOURTH,  // 4つ目の数字
  PLUS,           // 「+」
  MINUS,          // 「-」
  MULTIPLIED_BY,  // 「×」
  DIVIDED_BY,     // 「÷」
}

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
    SquareButtonComponent,
    CircleButtonComponent
],
  templateUrl: './make-ten.component.html',
  styleUrl: './make-ten.component.scss'
})
export class MakeTenComponent implements OnInit, OnDestroy {
  public readonly CircleButtonType = CIRCLE_BUTTON_TYPE;
  public readonly CircleButtonColor = CIRCLE_BUTTON_COLOR;
  public readonly SquareButtonColor = SQUARE_BUTTON_COLOR;
  private readonly CircleButtonSize: number = 62; // 丸ボタンの大きさ(px)
  private readonly CircleButtonMargin: number = 16; // 隣り合う丸ボタンの間の幅
  private readonly NumberAndOperatorCircleButtonMargin: number = 20; // 縦に並ぶ数字と演算子の丸ボタンの間の幅
  private readonly SelectAndNumberCircleButtonMargin: number = 60; // 縦に並ぶ選択と数字の丸ボタンの間の幅
  private readonly MaxQuestionCount: number = 5; // 最大問題数
  
  
  /**
   * 丸ボタンエリア内の位置の値
   * 
   * 丸ボタン押下の度に位置の値を算出しなくてもいいように
   * 初期表示時や画面リサイズ時に位置の値を先に算出してこの変数で保持する
   * 丸ボタン押下時にはこの変数の値を設定する
   */
  public readonly PositionInCircleButtonArea = { // TODO: 動作確認のためprivate → public
    numberFirst: { top: 0, left: 0 },   // 1つ目の数字ボタンの初期位置
    numberSecond: { top: 0, left: 0 },  // 2つ目の数字ボタンの初期位置
    numberThird: { top: 0, left: 0 },   // 3つ目の数字ボタンの初期位置
    numberFourth: { top: 0, left: 0 },  // 4つ目の数字ボタンの初期位置
    plus: { top: 0, left: 0 },          // 「+」ボタンの初期位置
    minus: { top: 0, left: 0 },         // 「-」ボタンの初期位置
    multipliedBy: { top: 0, left: 0 },  // 「×」ボタンの初期位置
    dividedBy: { top: 0, left: 0 },     // 「÷」ボタンの初期位置
    selectOne: { top: 0, left: 0 },     // 1つのボタンを選択した時の位置
    selectTwo: {                        // 2つのボタンを選択した時の位置
      first: { top: 0, left: 0 },
      second: { top: 0, left: 0 },
    },
    selectThree: {                      // 3つのボタンを選択した時の位置
      first: { top: 0, left: 0 },
      second: { top: 0, left: 0 },
      third: { top: 0, left: 0 },
    },
  };

  public questionCounter: number = 1; // 現在の問題数
  public time: number = 0; // 経過時間 (ms)
  private timerId: number = 0; // タイマー停止用のID

  private destroy$: Subject<void> = new Subject(); // Subscribe一括破棄用変数

  // TODO: 動作確認のため追加
  private isTimerRunning: boolean = false;

  /**
   * @constructor
   * @param displaySizeManagementService 画面サイズ管理サービス
   */
  constructor(private displaySizeManagementService: DisplaySizeManagementService) { }

  /**
   * ライフサイクル: コンポーネント生成時
   */
  public ngOnInit(): void {
    // アプリケーションサイズ変更通知
    this.displaySizeManagementService.applicationResizeNotification
    .pipe(takeUntil(this.destroy$))
    .subscribe(() => {
      setTimeout(() => {
        this.updatePositionInCircleButtonArea(); // 位置の値を更新
        // TODO: 丸ボタンの位置の値を更新する
      }, 0);
    });

    setTimeout(() => {
      this.updatePositionInCircleButtonArea(); // 位置の値を更新
      // TODO: 丸ボタンの位置の値を初期位置に設定する
    }, 0);
  }

  /**
   * ライフサイクル: コンポーネント破棄時
   */
  public ngOnDestroy(): void {
    // Subscribeの一括破棄
    this.destroy$.next();
    this.destroy$.complete();
  }

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
   * 丸ボタンクリックイベント
   * @param clickedButtonType クリックされたボタンの種類
   */
  public onClickCircleButton(clickedButtonType: CIRCLE_BUTTON_TYPE): void {
    console.log('Clicked CIRCLE button. :', clickedButtonType); // TODO: 動作確認のため追加
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

  /**
   * 丸ボタンエリア内の位置の値を更新
   * 
   * 初期表示時、画面リサイズ時のみ呼び出すこと
   */
  private updatePositionInCircleButtonArea(): void {
    // 丸ボタンエリアのサイズを取得する
    const circleButtonAreaHeight = document.getElementById('circle-button-area')?.offsetHeight;
    const circleButtonAreaWidth = document.getElementById('circle-button-area')?.offsetWidth;

    if (circleButtonAreaHeight === undefined || circleButtonAreaWidth === undefined) {
      throw Error('[app-make-ten] Could not get size of circle-button-area.');
    }
    else if (circleButtonAreaHeight <= this.CircleButtonSize * 4) {
      throw Error('[app-make-ten] Circle-button-area height is not enough.');
    }
    else if (circleButtonAreaWidth <= this.CircleButtonSize * 4 + 10 * 3) {
      throw Error('[app-make-ten] Circle-button-area width is not enough.');
    }

    // 演算子ボタンの初期位置を更新
    const operatorButtonPositionTop = circleButtonAreaHeight - this.CircleButtonSize;
    this.PositionInCircleButtonArea.plus.top = operatorButtonPositionTop;
    this.PositionInCircleButtonArea.minus.top = operatorButtonPositionTop;
    this.PositionInCircleButtonArea.multipliedBy.top = operatorButtonPositionTop;
    this.PositionInCircleButtonArea.dividedBy.top = operatorButtonPositionTop;
    
    const circleButtonLeftMargin = Math.trunc((circleButtonAreaWidth - (this.CircleButtonSize * 4 + this.CircleButtonMargin * 3)) / 2);
    this.PositionInCircleButtonArea.plus.left = circleButtonLeftMargin;
    this.PositionInCircleButtonArea.minus.left = circleButtonLeftMargin + this.CircleButtonSize + this.CircleButtonMargin;
    this.PositionInCircleButtonArea.multipliedBy.left = circleButtonLeftMargin + (this.CircleButtonSize + this.CircleButtonMargin) * 2;
    this.PositionInCircleButtonArea.dividedBy.left = circleButtonLeftMargin + (this.CircleButtonSize + this.CircleButtonMargin) * 3;

    // 数字ボタンの初期位置を更新
    const numberButtonPositionTop = operatorButtonPositionTop - (this.CircleButtonSize + this.NumberAndOperatorCircleButtonMargin);
    this.PositionInCircleButtonArea.numberFirst.top = numberButtonPositionTop;
    this.PositionInCircleButtonArea.numberSecond.top = numberButtonPositionTop;
    this.PositionInCircleButtonArea.numberThird.top = numberButtonPositionTop;
    this.PositionInCircleButtonArea.numberFourth.top = numberButtonPositionTop;
    
    this.PositionInCircleButtonArea.numberFirst.left = this.PositionInCircleButtonArea.plus.left;
    this.PositionInCircleButtonArea.numberSecond.left = this.PositionInCircleButtonArea.minus.left;
    this.PositionInCircleButtonArea.numberThird.left = this.PositionInCircleButtonArea.multipliedBy.left;
    this.PositionInCircleButtonArea.numberFourth.left = this.PositionInCircleButtonArea.dividedBy.left;

    // 選択した時の位置を更新
    const selectButtonTop = numberButtonPositionTop - (this.CircleButtonSize + this.SelectAndNumberCircleButtonMargin);
    this.PositionInCircleButtonArea.selectOne.top = selectButtonTop;
    this.PositionInCircleButtonArea.selectTwo.first.top = selectButtonTop;
    this.PositionInCircleButtonArea.selectTwo.second.top = selectButtonTop;
    this.PositionInCircleButtonArea.selectThree.first.top = selectButtonTop;
    this.PositionInCircleButtonArea.selectThree.second.top = selectButtonTop;
    this.PositionInCircleButtonArea.selectThree.third.top = selectButtonTop;

    this.PositionInCircleButtonArea.selectOne.left = Math.trunc((circleButtonAreaWidth - this.CircleButtonSize) / 2);
    this.PositionInCircleButtonArea.selectTwo.first.left = this.PositionInCircleButtonArea.numberSecond.left;
    this.PositionInCircleButtonArea.selectTwo.second.left = this.PositionInCircleButtonArea.numberThird.left;
    this.PositionInCircleButtonArea.selectThree.first.left = this.PositionInCircleButtonArea.selectOne.left - this.CircleButtonMargin- this.CircleButtonSize;
    this.PositionInCircleButtonArea.selectThree.second.left = this.PositionInCircleButtonArea.selectOne.left;
    this.PositionInCircleButtonArea.selectThree.third.left = this.PositionInCircleButtonArea.selectOne.left + this.CircleButtonMargin + this.CircleButtonSize;
  }
}

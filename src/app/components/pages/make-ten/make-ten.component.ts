import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { TimeFormatDirective } from '../../../core/directive/time-format.directive';
import { MaxTime, VisiblePageAnimationTime } from '../../../core/constants';
import { SQUARE_BUTTON_COLOR, SquareButtonComponent } from "../../share/square-button/square-button.component";
import { CIRCLE_BUTTON_COLOR, CircleButtonComponent } from "./unique-components/circle-button/circle-button.component";
import { DisplaySizeManagementService } from '../../../core/services/display-size-management.service';
import { Subject, takeUntil } from 'rxjs';

/**
 * 丸ボタンの種類
 */
export enum CIRCLE_BUTTON_TYPE {
  NUMBER_FIRST,             // 1つ目の数字
  NUMBER_SECOND,            // 2つ目の数字
  NUMBER_THIRD,             // 3つ目の数字
  NUMBER_FOURTH,            // 4つ目の数字
  PLUS,                     // 「+」
  MINUS,                    // 「-」
  MULTIPLIED_BY,            // 「×」
  DIVIDED_BY,               // 「÷」
  CALCULATED_NUMBER_FIRST,  // 算出された1つ目の数字
  CALCULATED_NUMBER_SECOND, // 算出された2つ目の数字
  CALCULATED_NUMBER_THIRD,  // 算出された3つ目の数字
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
  private readonly InitCircleButtonTransitionTime: number = 300; // 丸ボタン初期化時のtransition時間(ms)
  // 丸ボタン初期化時のtransition
  private readonly InitCircleButtonTransition: string = 'top ' + this.InitCircleButtonTransitionTime + 'ms,'
                                                        +'left ' + this.InitCircleButtonTransitionTime + 'ms';
  private readonly CircleButtonTransition: string = 'top 100ms, left 100ms'; // 丸ボタン通常時のtransition
  
  /**
   * 丸ボタンエリア内の位置の値
   * 
   * 丸ボタン押下の度に位置の値を算出しなくてもいいように
   * 初期表示時や画面リサイズ時に位置の値を先に算出してこの変数で保持する
   * 丸ボタン押下時にはこの変数の値を設定する
   */
  private positionInCircleButtonArea = {
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

  /**
   * 丸ボタンのラベル、表示非表示、表示位置などのパラメータ
   */
  public circleButtonParams = {
    transition: this.InitCircleButtonTransition,
    numberFirst: { label: '', isVisible: true, top: 0, left: 0 },             // 1つ目の数字ボタン
    numberSecond: { label: '', isVisible: true, top: 0, left: 0 },            // 2つ目の数字ボタン
    numberThird: { label: '', isVisible: true, top: 0, left: 0 },             // 3つ目の数字ボタン
    numberFourth: { label: '', isVisible: true, top: 0, left: 0 },            // 4つ目の数字ボタン
    plus: { label: '＋', top: 0, left: 0 },                                   // 「+」ボタンの初期位置
    minus: { label: '−', top: 0, left: 0 },                                   // 「-」ボタンの初期位置
    multipliedBy: { label: '×', top: 0, left: 0 },                            // 「×」ボタン
    dividedBy: { label: '÷', top: 0, left: 0 },                               // 「÷」ボタン
    calculatedNumberFirst: { label: '', isVisible: false, top: 0, left: 0 },  // 1つ目の算出された数字ボタン
    calculatedNumberSecond: { label: '', isVisible: false, top: 0, left: 0 }, // 2つ目の算出された数字ボタン
    calculatedNumberThird: { label: '', isVisible: false, top: 0, left: 0 },  // 3つ目の算出された数字ボタン
  };

  public questionCounter: number = 1; // 現在の問題数

  /**
   * 問題リスト(全5問)
   */
  private questionList: number[][] = [
    [1, 2, 3, 4],
    [11,12, 13, 14],
    [21, 22, 23, 24],
    [31, 32, 33, 34],
    [41, 42, 43, 44],
  ];
  
  public time: number = 0; // 経過時間 (ms)
  private timerId: number = 0; // タイマー停止用のID
  public isCompleteInitCircleButton: boolean = false; // 丸ボタン初期化完了フラグ

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
        // TODO: 丸ボタンの位置を更新する
      }, 0);
    });

    // TODO: 問題を生成する

    setTimeout(() => {
      this.updatePositionInCircleButtonArea(); // 位置の値を更新
      this.initCircleButton(true); // 丸ボタンの初期化処理
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

    // TODD: 動作確認のため追加
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
    this.initCircleButton(false); // 丸ボタンの初期化処理
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
    this.positionInCircleButtonArea.plus.top = operatorButtonPositionTop;
    this.positionInCircleButtonArea.minus.top = operatorButtonPositionTop;
    this.positionInCircleButtonArea.multipliedBy.top = operatorButtonPositionTop;
    this.positionInCircleButtonArea.dividedBy.top = operatorButtonPositionTop;
    
    const circleButtonLeftMargin = Math.trunc((circleButtonAreaWidth - (this.CircleButtonSize * 4 + this.CircleButtonMargin * 3)) / 2);
    this.positionInCircleButtonArea.plus.left = circleButtonLeftMargin;
    this.positionInCircleButtonArea.minus.left = circleButtonLeftMargin + this.CircleButtonSize + this.CircleButtonMargin;
    this.positionInCircleButtonArea.multipliedBy.left = circleButtonLeftMargin + (this.CircleButtonSize + this.CircleButtonMargin) * 2;
    this.positionInCircleButtonArea.dividedBy.left = circleButtonLeftMargin + (this.CircleButtonSize + this.CircleButtonMargin) * 3;

    // 数字ボタンの初期位置を更新
    const numberButtonPositionTop = operatorButtonPositionTop - (this.CircleButtonSize + this.NumberAndOperatorCircleButtonMargin);
    this.positionInCircleButtonArea.numberFirst.top = numberButtonPositionTop;
    this.positionInCircleButtonArea.numberSecond.top = numberButtonPositionTop;
    this.positionInCircleButtonArea.numberThird.top = numberButtonPositionTop;
    this.positionInCircleButtonArea.numberFourth.top = numberButtonPositionTop;
    
    this.positionInCircleButtonArea.numberFirst.left = this.positionInCircleButtonArea.plus.left;
    this.positionInCircleButtonArea.numberSecond.left = this.positionInCircleButtonArea.minus.left;
    this.positionInCircleButtonArea.numberThird.left = this.positionInCircleButtonArea.multipliedBy.left;
    this.positionInCircleButtonArea.numberFourth.left = this.positionInCircleButtonArea.dividedBy.left;

    // 選択した時の位置を更新
    const selectButtonTop = numberButtonPositionTop - (this.CircleButtonSize + this.SelectAndNumberCircleButtonMargin);
    this.positionInCircleButtonArea.selectOne.top = selectButtonTop;
    this.positionInCircleButtonArea.selectTwo.first.top = selectButtonTop;
    this.positionInCircleButtonArea.selectTwo.second.top = selectButtonTop;
    this.positionInCircleButtonArea.selectThree.first.top = selectButtonTop;
    this.positionInCircleButtonArea.selectThree.second.top = selectButtonTop;
    this.positionInCircleButtonArea.selectThree.third.top = selectButtonTop;

    this.positionInCircleButtonArea.selectOne.left = Math.trunc((circleButtonAreaWidth - this.CircleButtonSize) / 2);
    this.positionInCircleButtonArea.selectTwo.first.left = this.positionInCircleButtonArea.numberSecond.left;
    this.positionInCircleButtonArea.selectTwo.second.left = this.positionInCircleButtonArea.numberThird.left;
    this.positionInCircleButtonArea.selectThree.first.left = this.positionInCircleButtonArea.selectOne.left - this.CircleButtonMargin- this.CircleButtonSize;
    this.positionInCircleButtonArea.selectThree.second.left = this.positionInCircleButtonArea.selectOne.left;
    this.positionInCircleButtonArea.selectThree.third.left = this.positionInCircleButtonArea.selectOne.left + this.CircleButtonMargin + this.CircleButtonSize;
  }

  /**
   * 丸ボタンを初期化する
   * @param isPageVisible ページ表示時か否か
   */
  private initCircleButton(isPageVisible: boolean): void {
    // 数字ボタンの表示非表示を設定する
    this.circleButtonParams.numberFirst.isVisible = true;
    this.circleButtonParams.numberSecond.isVisible = true;
    this.circleButtonParams.numberThird.isVisible = true;
    this.circleButtonParams.numberFourth.isVisible = true;
    this.circleButtonParams.calculatedNumberFirst.isVisible = false;
    this.circleButtonParams.calculatedNumberSecond.isVisible = false;
    this.circleButtonParams.calculatedNumberThird.isVisible = false;

    // 数字ボタンのラベルに問題を設定する
    this.circleButtonParams.numberFirst.label = this.questionList[this.questionCounter - 1][0].toString();
    this.circleButtonParams.numberSecond.label = this.questionList[this.questionCounter - 1][1].toString();
    this.circleButtonParams.numberThird.label = this.questionList[this.questionCounter - 1][2].toString();
    this.circleButtonParams.numberFourth.label = this.questionList[this.questionCounter - 1][3].toString();

    // 丸ボタン表示位置をを1つのボタンを選択した位置に設定
    this.circleButtonParams.numberFirst.top = this.positionInCircleButtonArea.selectOne.top;
    this.circleButtonParams.numberFirst.left = this.positionInCircleButtonArea.selectOne.left;
    this.circleButtonParams.numberSecond.top = this.positionInCircleButtonArea.selectOne.top;
    this.circleButtonParams.numberSecond.left = this.positionInCircleButtonArea.selectOne.left;
    this.circleButtonParams.numberThird.top = this.positionInCircleButtonArea.selectOne.top;
    this.circleButtonParams.numberThird.left = this.positionInCircleButtonArea.selectOne.left;
    this.circleButtonParams.numberFourth.top = this.positionInCircleButtonArea.selectOne.top;
    this.circleButtonParams.numberFourth.left = this.positionInCircleButtonArea.selectOne.left;
    this.circleButtonParams.plus.top = this.positionInCircleButtonArea.selectOne.top;
    this.circleButtonParams.plus.left = this.positionInCircleButtonArea.selectOne.left;
    this.circleButtonParams.minus.top = this.positionInCircleButtonArea.selectOne.top;
    this.circleButtonParams.minus.left = this.positionInCircleButtonArea.selectOne.left;
    this.circleButtonParams.multipliedBy.top = this.positionInCircleButtonArea.selectOne.top;
    this.circleButtonParams.multipliedBy.left = this.positionInCircleButtonArea.selectOne.left;
    this.circleButtonParams.dividedBy.top = this.positionInCircleButtonArea.selectOne.top;
    this.circleButtonParams.dividedBy.left = this.positionInCircleButtonArea.selectOne.left;
    this.circleButtonParams.calculatedNumberFirst.top = this.positionInCircleButtonArea.selectOne.top;
    this.circleButtonParams.calculatedNumberFirst.left = this.positionInCircleButtonArea.selectOne.left;
    this.circleButtonParams.calculatedNumberSecond.top = this.positionInCircleButtonArea.selectOne.top;
    this.circleButtonParams.calculatedNumberSecond.left = this.positionInCircleButtonArea.selectOne.left;
    this.circleButtonParams.calculatedNumberThird.top = this.positionInCircleButtonArea.selectOne.top;
    this.circleButtonParams.calculatedNumberThird.left = this.positionInCircleButtonArea.selectOne.left;

    // 500ms後に丸ボタンを各初期位置に設定する
    let timeout = 200;
    // ページ遷移時の場合は表示アニメーション時間を加算する
    if (isPageVisible) {
      timeout += VisiblePageAnimationTime;
    }
    setTimeout(() => {
      this.circleButtonParams.numberFirst.top = this.positionInCircleButtonArea.numberFirst.top;
      this.circleButtonParams.numberFirst.left = this.positionInCircleButtonArea.numberFirst.left;
      this.circleButtonParams.numberSecond.top = this.positionInCircleButtonArea.numberSecond.top;
      this.circleButtonParams.numberSecond.left = this.positionInCircleButtonArea.numberSecond.left;
      this.circleButtonParams.numberThird.top = this.positionInCircleButtonArea.numberThird.top;
      this.circleButtonParams.numberThird.left = this.positionInCircleButtonArea.numberThird.left;
      this.circleButtonParams.numberFourth.top = this.positionInCircleButtonArea.numberFourth.top;
      this.circleButtonParams.numberFourth.left = this.positionInCircleButtonArea.numberFourth.left;
      this.circleButtonParams.plus.top = this.positionInCircleButtonArea.plus.top;
      this.circleButtonParams.plus.left = this.positionInCircleButtonArea.plus.left;
      this.circleButtonParams.minus.top = this.positionInCircleButtonArea.minus.top;
      this.circleButtonParams.minus.left = this.positionInCircleButtonArea.minus.left;
      this.circleButtonParams.multipliedBy.top = this.positionInCircleButtonArea.multipliedBy.top;
      this.circleButtonParams.multipliedBy.left = this.positionInCircleButtonArea.multipliedBy.left;
      this.circleButtonParams.dividedBy.top = this.positionInCircleButtonArea.dividedBy.top;
      this.circleButtonParams.dividedBy.left = this.positionInCircleButtonArea.dividedBy.left;

      // ページ遷移時のアニメーション終了後にアニメーション時間を再設定する
      if (isPageVisible) {
        setTimeout(() => {
          this.circleButtonParams.transition = this.CircleButtonTransition;
        }, this.InitCircleButtonTransitionTime);
      }
    }, timeout);
  }
}

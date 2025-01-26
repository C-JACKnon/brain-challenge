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
 * 演算アニメーション状態
 */
export enum CALCULATE_ANIMATION_CONDITION {
  FINISH,     // 終了（デフォルト）
  WAIT_START, // 開始待機
  START,      // 開始
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
  private readonly ResetWaitTime: number = 200; // リセットボタン押下時の待機時間(ms)
  private readonly InitCircleButtonTransitionTime: number = 300; // 丸ボタン初期化時のtransition時間(ms)
  // 丸ボタン初期化時のtransition
  private readonly InitCircleButtonTransition: string = 'top ' + this.InitCircleButtonTransitionTime + 'ms,'
                                                        +'left ' + this.InitCircleButtonTransitionTime + 'ms';
  private readonly CircleButtonTransition: string = 'top 100ms, left 100ms'; // 丸ボタン通常時のtransition
  private readonly StartCalculateAnimationWaitTime: number = 80; // 演算アニメーションの開始待機時間(ms)
  private readonly FinishCalculateAfterWaitTime: number = 100; // 演算終了後の待機時間(ms)

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
    plus: { label: '＋', isVisible: true, top: 0, left: 0 },                  // 「+」ボタンの初期位置
    minus: { label: '−', isVisible: true, top: 0, left: 0 },                  // 「-」ボタンの初期位置
    multipliedBy: { label: '×', isVisible: true, top: 0, left: 0 },           // 「×」ボタン
    dividedBy: { label: '÷', isVisible: true, top: 0, left: 0 },              // 「÷」ボタン
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

  private selectedButtonList: CIRCLE_BUTTON_TYPE[] = []; // 選択状態の丸ボタンリスト
  
  // 1つ目の算出された数字ボタンの表示位置
  private calculatedNumberFirstPosition: 
    CIRCLE_BUTTON_TYPE.NUMBER_FIRST
    | CIRCLE_BUTTON_TYPE.NUMBER_SECOND
    | CIRCLE_BUTTON_TYPE.NUMBER_THIRD
    | CIRCLE_BUTTON_TYPE.NUMBER_FOURTH
    = CIRCLE_BUTTON_TYPE.NUMBER_FIRST;

  // 2つ目の算出された数字ボタンの表示位置
  private calculatedNumberSecondPosition: 
    CIRCLE_BUTTON_TYPE.NUMBER_FIRST
    | CIRCLE_BUTTON_TYPE.NUMBER_SECOND
    | CIRCLE_BUTTON_TYPE.NUMBER_THIRD
    | CIRCLE_BUTTON_TYPE.NUMBER_FOURTH
    = CIRCLE_BUTTON_TYPE.NUMBER_SECOND;

  private calculateAnimationCondition: CALCULATE_ANIMATION_CONDITION = CALCULATE_ANIMATION_CONDITION.FINISH; // 演算アニメーション状態
  
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
      this.setCalculateAnimation(); // 演算アニメーションの設定
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
   * @param clickedButton クリックされたボタン
   */
  public onClickCircleButton(clickedButton: CIRCLE_BUTTON_TYPE): void {
    if (this.selectedButtonList.length === 3) {
      return;
    }

    // クリックされたボタンが選択されているか判定する
    if (this.selectedButtonList.includes(clickedButton)) {
      // 非選択状態にする
      this.unselectCircleButton(clickedButton);
    }
    else {
      // 選択状態にする
      this.selectCircleButton(clickedButton);

      // 回答する場合（2回演算が行われた状態で3つの丸ボタンを選択状態にした場合）
      if (this.getCalculateCount() === 2 && this.selectedButtonList.length === 3) {
        // TODO: タイマーストップ処理
      }
    }
  }

  /**
   * 先行入力用透明丸ボタンクリックイベント
   * @param clickedButton クリックされたボタン
   */
  public onClickClearCircleButton(clickedButton: CIRCLE_BUTTON_TYPE): void {
    // 対応する丸ボタンのクリックイベントを発火させる
    const parentElement = document.getElementById(`circle-button-${clickedButton}`);
    if (parentElement === null) {
      throw new Error(`[Make10] onClickClearCircleButton(${clickedButton}) : Failed to get element.`);
    }
    const targetElement = parentElement.firstChild;
    if (targetElement === null) {
      throw new Error(`[Make10] onClickClearCircleButton(${clickedButton}) : Failed to get element.`);
    }
    targetElement.dispatchEvent(new Event('click'));
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
    this.selectedButtonList.length = 0;

    // 丸ボタンの表示非表示を設定する
    this.circleButtonParams.numberFirst.isVisible = true;
    this.circleButtonParams.numberSecond.isVisible = true;
    this.circleButtonParams.numberThird.isVisible = true;
    this.circleButtonParams.numberFourth.isVisible = true;
    this.circleButtonParams.plus.isVisible = true;
    this.circleButtonParams.minus.isVisible = true;
    this.circleButtonParams.multipliedBy.isVisible = true;
    this.circleButtonParams.dividedBy.isVisible = true;
    this.circleButtonParams.calculatedNumberFirst.isVisible = false;
    this.circleButtonParams.calculatedNumberSecond.isVisible = false;
    this.circleButtonParams.calculatedNumberThird.isVisible = false;

    // 数字ボタンのラベルに問題を設定する
    this.circleButtonParams.numberFirst.label = this.questionList[this.questionCounter - 1][0].toString();
    this.circleButtonParams.numberSecond.label = this.questionList[this.questionCounter - 1][1].toString();
    this.circleButtonParams.numberThird.label = this.questionList[this.questionCounter - 1][2].toString();
    this.circleButtonParams.numberFourth.label = this.questionList[this.questionCounter - 1][3].toString();

    // 丸ボタンの表示位置を1つのボタンを選択した位置に設定
    this.setCircleButtonPosition(CIRCLE_BUTTON_TYPE.NUMBER_FIRST, this.positionInCircleButtonArea.selectOne);
    this.setCircleButtonPosition(CIRCLE_BUTTON_TYPE.NUMBER_SECOND, this.positionInCircleButtonArea.selectOne);
    this.setCircleButtonPosition(CIRCLE_BUTTON_TYPE.NUMBER_THIRD, this.positionInCircleButtonArea.selectOne);
    this.setCircleButtonPosition(CIRCLE_BUTTON_TYPE.NUMBER_FOURTH, this.positionInCircleButtonArea.selectOne);
    this.setCircleButtonPosition(CIRCLE_BUTTON_TYPE.PLUS, this.positionInCircleButtonArea.selectOne);
    this.setCircleButtonPosition(CIRCLE_BUTTON_TYPE.MINUS, this.positionInCircleButtonArea.selectOne);
    this.setCircleButtonPosition(CIRCLE_BUTTON_TYPE.MULTIPLIED_BY, this.positionInCircleButtonArea.selectOne);
    this.setCircleButtonPosition(CIRCLE_BUTTON_TYPE.DIVIDED_BY, this.positionInCircleButtonArea.selectOne);
    this.setCircleButtonPosition(CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_FIRST, this.positionInCircleButtonArea.selectOne);
    this.setCircleButtonPosition(CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_SECOND, this.positionInCircleButtonArea.selectOne);
    this.setCircleButtonPosition(CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_THIRD, this.positionInCircleButtonArea.selectOne);

    const waitTime = isPageVisible ? 400 + VisiblePageAnimationTime : this.ResetWaitTime;
    setTimeout(() => {
      this.resetCircleButtonPosition(CIRCLE_BUTTON_TYPE.NUMBER_FIRST);
      this.resetCircleButtonPosition(CIRCLE_BUTTON_TYPE.NUMBER_SECOND);
      this.resetCircleButtonPosition(CIRCLE_BUTTON_TYPE.NUMBER_THIRD);
      this.resetCircleButtonPosition(CIRCLE_BUTTON_TYPE.NUMBER_FOURTH);
      this.resetCircleButtonPosition(CIRCLE_BUTTON_TYPE.PLUS);
      this.resetCircleButtonPosition(CIRCLE_BUTTON_TYPE.MINUS);
      this.resetCircleButtonPosition(CIRCLE_BUTTON_TYPE.MULTIPLIED_BY);
      this.resetCircleButtonPosition(CIRCLE_BUTTON_TYPE.DIVIDED_BY);

      // ページ遷移時のアニメーション終了後にアニメーション時間を再設定する
      if (isPageVisible) {
        setTimeout(() => {
          this.circleButtonParams.transition = this.CircleButtonTransition;
        }, this.InitCircleButtonTransitionTime);
      }
    }, waitTime);
  }

  /**
   * 対象の丸ボタンを選択状態にする
   * @param targetButton 選択状態にする丸ボタン
   */
  private selectCircleButton(targetButton: CIRCLE_BUTTON_TYPE): void {
    // 選択状態の丸ボタンがない場合
    if (this.selectedButtonList.length === 0) {
      this.setCircleButtonPosition(targetButton, this.positionInCircleButtonArea.selectOne);
      this.selectedButtonList.push(targetButton);
    }
    // 選択状態の丸ボタンが1つの場合
    else if (this.selectedButtonList.length === 1) {
      // 既に演算ボタンが選択されている場合
      if (this.isSelectedOperatorButton()) {
        // 選択状態にするボタンが数字ボタンの場合
        if (this.isNumberCircleButton(targetButton)) {
          // 選択ボタンを[数字ボタン, 演算ボタン]の状態にする
          this.selectedButtonList.unshift(targetButton);
        }
        else {
          // 選択状態の演算ボタンを交換する
          this.setCircleButtonPosition(targetButton, this.positionInCircleButtonArea.selectOne);
          this.resetCircleButtonPosition(this.selectedButtonList[0]);
          this.selectedButtonList[0] = targetButton;
          return;
        }
      }
      // まだ演算ボタンが選択されていない場合
      else {
        this.selectedButtonList.push(targetButton);
      }
      this.setCircleButtonPosition(this.selectedButtonList[0], this.positionInCircleButtonArea.selectTwo.first);
      this.setCircleButtonPosition(this.selectedButtonList[1], this.positionInCircleButtonArea.selectTwo.second);
    }
    // 選択状態の丸ボタンが2つの場合
    else if (this.selectedButtonList.length === 2) {
      // 既に演算ボタンが選択されている場合
      if (this.isSelectedOperatorButton()) {
        // 選択状態にするボタンが数字ボタンの場合
        if (this.isNumberCircleButton(targetButton)) {
          // 選択ボタンを[数字ボタン, 演算ボタン, 数字ボタン]の状態にする
          this.setCircleButtonPosition(this.selectedButtonList[0], this.positionInCircleButtonArea.selectThree.first);
          this.setCircleButtonPosition(this.selectedButtonList[1], this.positionInCircleButtonArea.selectThree.second);
          this.setCircleButtonPosition(targetButton, this.positionInCircleButtonArea.selectThree.third);
          this.selectedButtonList.push(targetButton);
        }
        else {
          // 選択状態の演算ボタンを交換する
          this.setCircleButtonPosition(targetButton, this.positionInCircleButtonArea.selectTwo.second);
          this.resetCircleButtonPosition(this.selectedButtonList[1]);
          this.selectedButtonList[1] = targetButton;
          return;
        }
      }
      // まだ演算ボタンが選択されていない場合
      else {
        // 選択状態にするボタンが数字ボタンの場合
        if (this.isNumberCircleButton(targetButton)) {
          // 選択状態の2つ目の数字ボタンを交換する
          this.setCircleButtonPosition(targetButton, this.positionInCircleButtonArea.selectTwo.second);
          this.resetCircleButtonPosition(this.selectedButtonList[1]);
          this.selectedButtonList[1] = targetButton;
          return;
        }
        else {
          // 選択ボタンを[数字ボタン, 演算ボタン, 数字ボタン]の状態にする
          this.setCircleButtonPosition(this.selectedButtonList[0], this.positionInCircleButtonArea.selectThree.first);
          this.setCircleButtonPosition(targetButton, this.positionInCircleButtonArea.selectThree.second);
          this.setCircleButtonPosition(this.selectedButtonList[1], this.positionInCircleButtonArea.selectThree.third);
          this.selectedButtonList.splice(1, 0, targetButton);
          return;
        }
      }
    }
  }

  /**
   * 対象の丸ボタンを非選択状態にする
   * @param targetButton 非選択状態にする丸ボタン
   */
  private unselectCircleButton(targetButton: CIRCLE_BUTTON_TYPE): void {
    const index = this.selectedButtonList.indexOf(targetButton);
    this.resetCircleButtonPosition(this.selectedButtonList[index]);
    // 選択状態の丸ボタンが2つの場合
    if (this.selectedButtonList.length === 2) {
      // 対象でない丸ボタンを1つのボタンを選択したときの位置にする
      this.setCircleButtonPosition(this.selectedButtonList[1 - index], this.positionInCircleButtonArea.selectOne);
    }
    this.selectedButtonList.splice(index, 1);
  }

  /**
   * 対象の丸ボタンを初期位置に戻す
   * @param targetButton 対象の丸ボタン
   */
  private resetCircleButtonPosition(targetButton: CIRCLE_BUTTON_TYPE): void {
    if (targetButton === CIRCLE_BUTTON_TYPE.NUMBER_FIRST) {
      this.circleButtonParams.numberFirst.top = this.positionInCircleButtonArea.numberFirst.top;
      this.circleButtonParams.numberFirst.left = this.positionInCircleButtonArea.numberFirst.left;
      return;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.NUMBER_SECOND) {
      this.circleButtonParams.numberSecond.top = this.positionInCircleButtonArea.numberSecond.top;
      this.circleButtonParams.numberSecond.left = this.positionInCircleButtonArea.numberSecond.left;
      return;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.NUMBER_THIRD) {
      this.circleButtonParams.numberThird.top = this.positionInCircleButtonArea.numberThird.top;
      this.circleButtonParams.numberThird.left = this.positionInCircleButtonArea.numberThird.left;
      return;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.NUMBER_FOURTH) {
      this.circleButtonParams.numberFourth.top = this.positionInCircleButtonArea.numberFourth.top;
      this.circleButtonParams.numberFourth.left = this.positionInCircleButtonArea.numberFourth.left;
      return;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.PLUS) {
      this.circleButtonParams.plus.top = this.positionInCircleButtonArea.plus.top;
      this.circleButtonParams.plus.left = this.positionInCircleButtonArea.plus.left;
      return;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.MINUS) {
      this.circleButtonParams.minus.top = this.positionInCircleButtonArea.minus.top;
      this.circleButtonParams.minus.left = this.positionInCircleButtonArea.minus.left;
      return;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.MULTIPLIED_BY) {
      this.circleButtonParams.multipliedBy.top = this.positionInCircleButtonArea.multipliedBy.top;
      this.circleButtonParams.multipliedBy.left = this.positionInCircleButtonArea.multipliedBy.left;
      return;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.DIVIDED_BY) {
      this.circleButtonParams.dividedBy.top = this.positionInCircleButtonArea.dividedBy.top;
      this.circleButtonParams.dividedBy.left = this.positionInCircleButtonArea.dividedBy.left;
      return;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_FIRST
      || targetButton === CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_SECOND) {
      this.resetCalculatedNumberButtonPosition(targetButton);
      return;
    }
  }

  /**
   * 対象の丸ボタンの表示位置を設定する
   * @param targetButton 対象の丸ボタン
   * @param position 設定する表示位置
   */
  private setCircleButtonPosition(targetButton: CIRCLE_BUTTON_TYPE, position: { top: number, left: number }): void {
    if (targetButton === CIRCLE_BUTTON_TYPE.NUMBER_FIRST) {
      this.circleButtonParams.numberFirst.top = position.top;
      this.circleButtonParams.numberFirst.left = position.left;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.NUMBER_SECOND) {
      this.circleButtonParams.numberSecond.top = position.top;
      this.circleButtonParams.numberSecond.left = position.left;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.NUMBER_THIRD) {
      this.circleButtonParams.numberThird.top = position.top;
      this.circleButtonParams.numberThird.left = position.left;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.NUMBER_FOURTH) {
      this.circleButtonParams.numberFourth.top = position.top;
      this.circleButtonParams.numberFourth.left = position.left;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.PLUS) {
      this.circleButtonParams.plus.top = position.top;
      this.circleButtonParams.plus.left = position.left;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.MINUS) {
      this.circleButtonParams.minus.top = position.top;
      this.circleButtonParams.minus.left = position.left;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.MULTIPLIED_BY) {
      this.circleButtonParams.multipliedBy.top = position.top;
      this.circleButtonParams.multipliedBy.left = position.left;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.DIVIDED_BY) {
      this.circleButtonParams.dividedBy.top = position.top;
      this.circleButtonParams.dividedBy.left = position.left;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_FIRST) {
      this.circleButtonParams.calculatedNumberFirst.top = position.top;
      this.circleButtonParams.calculatedNumberFirst.left = position.left;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_SECOND) {
      this.circleButtonParams.calculatedNumberSecond.top = position.top;
      this.circleButtonParams.calculatedNumberSecond.left = position.left;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_THIRD) {
      this.circleButtonParams.calculatedNumberThird.top = position.top;
      this.circleButtonParams.calculatedNumberThird.left = position.left;
    }
  }

  /**
   * 対象の丸ボタンの表示・非表示を設定する
   * @param targetButton 対象の丸ボタン
   * @param isVisible 設定する表示・非表示
   */
  private setIsVisibleCircleButton(targetButton: CIRCLE_BUTTON_TYPE, isVisible: boolean): void {
    if (targetButton === CIRCLE_BUTTON_TYPE.NUMBER_FIRST) {
      this.circleButtonParams.numberFirst.isVisible = isVisible;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.NUMBER_SECOND) {
      this.circleButtonParams.numberSecond.isVisible = isVisible;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.NUMBER_THIRD) {
      this.circleButtonParams.numberThird.isVisible = isVisible;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.NUMBER_FOURTH) {
      this.circleButtonParams.numberFourth.isVisible = isVisible;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.PLUS) {
      this.circleButtonParams.plus.isVisible = isVisible;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.MINUS) {
      this.circleButtonParams.minus.isVisible = isVisible;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.MULTIPLIED_BY) {
      this.circleButtonParams.multipliedBy.isVisible = isVisible;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.DIVIDED_BY) {
      this.circleButtonParams.dividedBy.isVisible = isVisible;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_FIRST) {
      this.circleButtonParams.calculatedNumberFirst.isVisible = isVisible;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_SECOND) {
      this.circleButtonParams.calculatedNumberSecond.isVisible = isVisible;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_THIRD) {
      this.circleButtonParams.calculatedNumberThird.isVisible = isVisible;
    }
  }

  /**
   * 対象の丸ボタンが数字ボタンかどうか判定する
   * @param targetButton 対象の丸ボタン
   * @returns 対象の丸ボタンが数字ボタンか否か
   */
  private isNumberCircleButton(targetButton: CIRCLE_BUTTON_TYPE): boolean {
    return targetButton != CIRCLE_BUTTON_TYPE.PLUS
      && targetButton != CIRCLE_BUTTON_TYPE.MINUS
      && targetButton != CIRCLE_BUTTON_TYPE.MULTIPLIED_BY
      && targetButton != CIRCLE_BUTTON_TYPE.DIVIDED_BY;
  }

  /**
   * 既に演算ボタンが選択されているか判定する
   * @returns いずれかの演算ボタンが選択状態か否か
   */
  private isSelectedOperatorButton(): boolean {
    return this.selectedButtonList.includes(CIRCLE_BUTTON_TYPE.PLUS)
      || this.selectedButtonList.includes(CIRCLE_BUTTON_TYPE.MINUS)
      || this.selectedButtonList.includes(CIRCLE_BUTTON_TYPE.MULTIPLIED_BY)
      || this.selectedButtonList.includes(CIRCLE_BUTTON_TYPE.DIVIDED_BY);
  }

  /**
   * 演算アニメーションの設定を行う
   */
  private setCalculateAnimation(): void {
    // 丸ボタンすべてにtransitionendイベントを付与する
    const circleButtonElements = document.querySelectorAll('.circle-button');
    circleButtonElements.forEach((element) => {
      element.addEventListener('transitionend', (event: Event) => {
        // 3つの丸ボタンが選択状態でないなら後続処理をしない
        if (this.selectedButtonList.length < 3) {
          return;
        }
        const transitionendEvent = event as TransitionEvent;
        
        // 3つの丸ボタンが選択状態となるアニメーションが終了した場合
        // （高さが変化するのは丸ボタンの選択状態を変更した場合のみ）
        if (transitionendEvent.propertyName === 'top' && this.calculateAnimationCondition === CALCULATE_ANIMATION_CONDITION.FINISH) {
          // 演算アニメーションが開始されてない場合、演算アニメーションを実行する
          this.calculateAnimationCondition = CALCULATE_ANIMATION_CONDITION.WAIT_START;
          window.setTimeout(() => {
            // 選択状態の丸ボタンを中央に集める
            this.setCircleButtonPosition(this.selectedButtonList[0], this.positionInCircleButtonArea.selectThree.second);
            this.setCircleButtonPosition(this.selectedButtonList[2], this.positionInCircleButtonArea.selectThree.second);
            this.calculateAnimationCondition = CALCULATE_ANIMATION_CONDITION.START;
          }, this.StartCalculateAnimationWaitTime);
        }
        // 演算アニメーションで選択状態の丸ボタンを中央に集めるアニメーションが終了した場合
        else if (transitionendEvent.propertyName === 'left' && this.calculateAnimationCondition === CALCULATE_ANIMATION_CONDITION.START) {
          this.calculateAnimationCondition = CALCULATE_ANIMATION_CONDITION.FINISH;
          
          // 現在の演算数を取得
          const calculateCount = this.getCalculateCount();
          
          // 選択状態の丸ボタンを全て非表示にする
          this.selectedButtonList.forEach((targetButton: CIRCLE_BUTTON_TYPE) => {
            this.setIsVisibleCircleButton(targetButton, false);
          });
          
          // 演算と算出された数字ボタンの表示をする
          if (calculateCount === 0) {
            // 1つ目の算出された数字ボタンを表示する
            this.circleButtonParams.calculatedNumberFirst.isVisible = true;
            this.circleButtonParams.calculatedNumberFirst.label = '10'; // TODO: 演算処理
            window.setTimeout(() => {
              // 算出された数字ボタンを非選択状態の位置に配置
              this.setCalculatedNumberButtonPosition(CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_FIRST);

              // 演算子ボタンを再表示して非選択状態の位置に配置
              this.setIsVisibleCircleButton(this.selectedButtonList[1], true);
              this.resetCircleButtonPosition(this.selectedButtonList[1]);
              this.selectedButtonList.length = 0;
            }, this.FinishCalculateAfterWaitTime);
            return;
          }
          else if (calculateCount === 1) {
            // 2つ目に算出された数字ボタンを表示する
            this.circleButtonParams.calculatedNumberSecond.isVisible = true;
            this.circleButtonParams.calculatedNumberSecond.label = '20'; // TODO: 演算処理
            window.setTimeout(() => {
              // 算出された数字ボタンを非選択状態の位置に配置
              this.setCalculatedNumberButtonPosition(CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_SECOND);
              
              // 演算子ボタンを再表示して非選択状態の位置に配置
              this.setIsVisibleCircleButton(this.selectedButtonList[1], true);
              this.resetCircleButtonPosition(this.selectedButtonList[1]);
              this.selectedButtonList.length = 0;
            }, this.FinishCalculateAfterWaitTime);
            return;
          }
          else if (calculateCount === 2) {
            // 3つ目に算出された数字ボタン（回答）を表示する
            this.circleButtonParams.calculatedNumberThird.isVisible = true;
            this.circleButtonParams.calculatedNumberThird.label = '30'; // TODO: 演算処理
            return;
          }
        }
      });
    });
  }

  /**
   * 現在の演算数を取得する
   * @returns 現在の演算数（0～2）
   */
  private getCalculateCount(): number {
    // 2つ目の算出数字ボタンが表示されている場合
    if (this.circleButtonParams.calculatedNumberSecond.isVisible) {
      return 2;
    }
    // 1つ目の算出数字ボタンが表示されている場合
    else if (this.circleButtonParams.calculatedNumberFirst.isVisible) {
      return 1;
    }
    return 0;
  }

  /**
   * 算出された数字ボタンの表示位置を設定する
   * ※この関数実行前に演算に使用した数字ボタンは非表示にしておくこと
   * @param targetButton 対象の算出された数字ボタン
   */
  private setCalculatedNumberButtonPosition(targetButton: CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_FIRST | CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_SECOND): void {
    // 1つ目の算出された数字ボタンは、非表示の数字ボタンの中で最も左にある数字ボタンの表示位置を設定する
    if (targetButton === CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_FIRST) {
      if (!this.circleButtonParams.numberFirst.isVisible) {
        this.circleButtonParams.calculatedNumberFirst.top = this.positionInCircleButtonArea.numberFirst.top;
        this.circleButtonParams.calculatedNumberFirst.left = this.positionInCircleButtonArea.numberFirst.left;
        this.calculatedNumberFirstPosition = CIRCLE_BUTTON_TYPE.NUMBER_FIRST;
        return;
      }
      else if (!this.circleButtonParams.numberSecond.isVisible) {
        this.circleButtonParams.calculatedNumberFirst.top = this.positionInCircleButtonArea.numberSecond.top;
        this.circleButtonParams.calculatedNumberFirst.left = this.positionInCircleButtonArea.numberSecond.left;
        this.calculatedNumberFirstPosition = CIRCLE_BUTTON_TYPE.NUMBER_SECOND;
        return;
      }
      else if (!this.circleButtonParams.numberThird.isVisible) {
        this.circleButtonParams.calculatedNumberFirst.top = this.positionInCircleButtonArea.numberThird.top;
        this.circleButtonParams.calculatedNumberFirst.left = this.positionInCircleButtonArea.numberThird.left;
        this.calculatedNumberFirstPosition = CIRCLE_BUTTON_TYPE.NUMBER_THIRD;
        return;
      }
      else if (!this.circleButtonParams.numberFourth.isVisible) {
        this.circleButtonParams.calculatedNumberFirst.top = this.positionInCircleButtonArea.numberFourth.top;
        this.circleButtonParams.calculatedNumberFirst.left = this.positionInCircleButtonArea.numberFourth.left;
        this.calculatedNumberFirstPosition = CIRCLE_BUTTON_TYPE.NUMBER_FOURTH;
        return;
      }
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_SECOND) {
      // 1つ目の算出された数字ボタンが表示されている場合、
      // 非表示の数字ボタンの中で1つ目の算出された数字ボタンが配置されていない、最も左にある数字ボタンの表示位置を設定する
      if (this.circleButtonParams.calculatedNumberFirst.isVisible) {
        if (!this.circleButtonParams.numberFirst.isVisible && this.calculatedNumberFirstPosition != CIRCLE_BUTTON_TYPE.NUMBER_FIRST) {
          this.circleButtonParams.calculatedNumberSecond.top = this.positionInCircleButtonArea.numberFirst.top;
          this.circleButtonParams.calculatedNumberSecond.left = this.positionInCircleButtonArea.numberFirst.left;
          this.calculatedNumberSecondPosition = CIRCLE_BUTTON_TYPE.NUMBER_FIRST;
          return;
        }
        else if (!this.circleButtonParams.numberSecond.isVisible && this.calculatedNumberFirstPosition != CIRCLE_BUTTON_TYPE.NUMBER_SECOND) {
          this.circleButtonParams.calculatedNumberSecond.top = this.positionInCircleButtonArea.numberSecond.top;
          this.circleButtonParams.calculatedNumberSecond.left = this.positionInCircleButtonArea.numberSecond.left;
          this.calculatedNumberSecondPosition = CIRCLE_BUTTON_TYPE.NUMBER_SECOND;
          return;
        }
        else if (!this.circleButtonParams.numberThird.isVisible && this.calculatedNumberFirstPosition != CIRCLE_BUTTON_TYPE.NUMBER_THIRD) {
          this.circleButtonParams.calculatedNumberSecond.top = this.positionInCircleButtonArea.numberThird.top;
          this.circleButtonParams.calculatedNumberSecond.left = this.positionInCircleButtonArea.numberThird.left;
          this.calculatedNumberSecondPosition = CIRCLE_BUTTON_TYPE.NUMBER_THIRD;
          return;
        }
        else if (!this.circleButtonParams.numberFourth.isVisible && this.calculatedNumberFirstPosition != CIRCLE_BUTTON_TYPE.NUMBER_FOURTH) {
          this.circleButtonParams.calculatedNumberSecond.top = this.positionInCircleButtonArea.numberFourth.top;
          this.circleButtonParams.calculatedNumberSecond.left = this.positionInCircleButtonArea.numberFourth.left;
          this.calculatedNumberSecondPosition = CIRCLE_BUTTON_TYPE.NUMBER_FOURTH;
          return;
        }
      }
      // 1つ目の算出された数字ボタンが非表示である場合、
      // 非表示の数字ボタンの中で最も左にある数字ボタンの表示位置を設定する
      else {
        if (!this.circleButtonParams.numberFirst.isVisible) {
          this.circleButtonParams.calculatedNumberSecond.top = this.positionInCircleButtonArea.numberFirst.top;
          this.circleButtonParams.calculatedNumberSecond.left = this.positionInCircleButtonArea.numberFirst.left;
          this.calculatedNumberSecondPosition = CIRCLE_BUTTON_TYPE.NUMBER_FIRST;
          return;
        }
        else if (!this.circleButtonParams.numberSecond.isVisible) {
          this.circleButtonParams.calculatedNumberSecond.top = this.positionInCircleButtonArea.numberSecond.top;
          this.circleButtonParams.calculatedNumberSecond.left = this.positionInCircleButtonArea.numberSecond.left;
          this.calculatedNumberSecondPosition = CIRCLE_BUTTON_TYPE.NUMBER_SECOND;
          return;
        }
        else if (!this.circleButtonParams.numberThird.isVisible) {
          this.circleButtonParams.calculatedNumberSecond.top = this.positionInCircleButtonArea.numberThird.top;
          this.circleButtonParams.calculatedNumberSecond.left = this.positionInCircleButtonArea.numberThird.left;
          this.calculatedNumberSecondPosition = CIRCLE_BUTTON_TYPE.NUMBER_THIRD;
          return;
        }
        else if (!this.circleButtonParams.numberFourth.isVisible) {
          this.circleButtonParams.calculatedNumberSecond.top = this.positionInCircleButtonArea.numberFourth.top;
          this.circleButtonParams.calculatedNumberSecond.left = this.positionInCircleButtonArea.numberFourth.left;
          this.calculatedNumberSecondPosition = CIRCLE_BUTTON_TYPE.NUMBER_FOURTH;
          return;
        }
      }
    }
    else {
      throw new Error(`[Make10] setCalculatedNumberButtonPosition(${targetButton}) : Unexpected argument set.`);
    }
  }

  /**
   * 算出された数字ボタンの表示位置をリセット（選択前状態に）する
   * @param targetButton 対象の丸ボタン
   */
  private resetCalculatedNumberButtonPosition(targetButton: CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_FIRST | CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_SECOND): void {
    if (targetButton === CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_FIRST) {
      if (this.calculatedNumberFirstPosition === CIRCLE_BUTTON_TYPE.NUMBER_FIRST) {
        this.circleButtonParams.calculatedNumberFirst.top = this.positionInCircleButtonArea.numberFirst.top;
        this.circleButtonParams.calculatedNumberFirst.left = this.positionInCircleButtonArea.numberFirst.left;
        return;
      }
      else if (this.calculatedNumberFirstPosition === CIRCLE_BUTTON_TYPE.NUMBER_SECOND) {
        this.circleButtonParams.calculatedNumberFirst.top = this.positionInCircleButtonArea.numberSecond.top;
        this.circleButtonParams.calculatedNumberFirst.left = this.positionInCircleButtonArea.numberSecond.left;
        return;
      }
      else if (this.calculatedNumberFirstPosition === CIRCLE_BUTTON_TYPE.NUMBER_THIRD) {
        this.circleButtonParams.calculatedNumberFirst.top = this.positionInCircleButtonArea.numberThird.top;
        this.circleButtonParams.calculatedNumberFirst.left = this.positionInCircleButtonArea.numberThird.left;
        return;
      }
      else if (this.calculatedNumberFirstPosition === CIRCLE_BUTTON_TYPE.NUMBER_FOURTH) {
        this.circleButtonParams.calculatedNumberFirst.top = this.positionInCircleButtonArea.numberFourth.top;
        this.circleButtonParams.calculatedNumberFirst.left = this.positionInCircleButtonArea.numberFourth.left;
        return;
      }
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_SECOND) {
      if (this.calculatedNumberSecondPosition === CIRCLE_BUTTON_TYPE.NUMBER_FIRST) {
        this.circleButtonParams.calculatedNumberSecond.top = this.positionInCircleButtonArea.numberFirst.top;
        this.circleButtonParams.calculatedNumberSecond.left = this.positionInCircleButtonArea.numberFirst.left;
      }
      else if (this.calculatedNumberSecondPosition === CIRCLE_BUTTON_TYPE.NUMBER_SECOND) {
        this.circleButtonParams.calculatedNumberSecond.top = this.positionInCircleButtonArea.numberSecond.top;
        this.circleButtonParams.calculatedNumberSecond.left = this.positionInCircleButtonArea.numberSecond.left;
      }
      else if (this.calculatedNumberSecondPosition === CIRCLE_BUTTON_TYPE.NUMBER_THIRD) {
        this.circleButtonParams.calculatedNumberSecond.top = this.positionInCircleButtonArea.numberThird.top;
        this.circleButtonParams.calculatedNumberSecond.left = this.positionInCircleButtonArea.numberThird.left;
        return;
      }
      else if (this.calculatedNumberSecondPosition === CIRCLE_BUTTON_TYPE.NUMBER_FOURTH) {
        this.circleButtonParams.calculatedNumberSecond.top = this.positionInCircleButtonArea.numberFourth.top;
        this.circleButtonParams.calculatedNumberSecond.left = this.positionInCircleButtonArea.numberFourth.left;
        return;
      }
    }
  }
}

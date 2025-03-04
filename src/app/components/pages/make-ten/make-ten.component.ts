import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { MaxTime, VisiblePageAnimationTime } from '../../../core/constants';
import { SQUARE_BUTTON_COLOR, SquareButtonComponent } from "../../share/square-button/square-button.component";
import { CIRCLE_BUTTON_COLOR, CircleButtonComponent } from "./unique-components/circle-button/circle-button.component";
import { DisplaySizeManagementService } from '../../../core/services/display-size-management.service';
import { Subject, takeUntil } from 'rxjs';
import { MakeTenQuestion, MakeTenQuestionList } from './make-ten-question-list';
import { GiveUpDialogComponent } from './unique-components/give-up-dialog/give-up-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { PAGE_ADDRESS } from '../../../app.routes';
import { ScoreTimePipe } from '../../../core/pipe/score-time.pipe';
import { StorageService } from '../../../core/services/storage.service';

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
    SquareButtonComponent,
    CircleButtonComponent,
    ScoreTimePipe
  ],
  templateUrl: './make-ten.component.html',
  styleUrl: './make-ten.component.scss'
})
export class MakeTenComponent implements OnInit, OnDestroy {
  private readonly displaySizeManagementService = inject(DisplaySizeManagementService); // 画面サイズ管理サービス
  private readonly changeComponentService = inject(ChangeComponentService); // 画面コンポーネント切替サービス
  private readonly storageService = inject(StorageService); // ストレージサービス
  
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
  private readonly InitCircleButtonTransition: string = `top ${this.InitCircleButtonTransitionTime}ms, left ${this.InitCircleButtonTransitionTime}ms`;
  private readonly CircleButtonTransitionTime: number = 100; // 丸ボタン通常時のtransition時間(ms)
  // 丸ボタン通常時のtransition
  private readonly CircleButtonTransition: string = `top ${this.CircleButtonTransitionTime}ms, left ${this.CircleButtonTransitionTime}ms`;
  private readonly StartCalculateAnimationWaitTime: number = 80; // 演算アニメーションの開始待機時間(ms)
  private readonly FinishCalculateAfterWaitTime: number = 100; // 演算終了後の待機時間(ms)
  private readonly AnswerAfterWaitTime: number = 500; // 回答後の待機時間(ms)
  private readonly dialog: MatDialog = inject(MatDialog); // ダイアログインスタンス

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
  private questionList: MakeTenQuestion[] = []; // 問題リスト

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

  private calculatedResultValue: string | null = null; // 計算結果の値（分母が0となる場合はnull）
  private currentCalculateCount: number = 0; // 現在の演算数
  private calculateAnimationCondition: CALCULATE_ANIMATION_CONDITION = CALCULATE_ANIMATION_CONDITION.FINISH; // 演算アニメーション状態
  public isStartAnswerEffect: boolean = false; // 正解時のアニメーション実行フラグ
  
  public time: number = 0; // 経過時間 (ms)
  private timerId: number = 0; // タイマー停止用のID
  public isRunningTimer: boolean = false; // タイマー計測中フラグ

  private destroy$: Subject<void> = new Subject(); // Subscribe一括破棄用変数

  // region LifeCycle Method

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
        // 正解している場合は後続処理を行わない
        if (this.currentCalculateCount === 2 && this.calculatedResultValue === '10') {
          return;
        }
        this.resetExecute(false); // リセット実行
      }, 0);
    });

    this.questionList = this.createQuestionList(); // 問題リストを生成する

    setTimeout(() => {
      this.setCalculateAnimation(); // 演算アニメーションの設定
      this.updatePositionInCircleButtonArea(); // 位置の値を更新
      this.resetExecute(true); // リセット実行
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

  // region Public Method

  /**
   * 白旗ボタンクリックイベント
   */
  public onClickFlagButton(): void {
    this.openGiveUpDialog(); // ギブアップダイアログを表示
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

      // 3つの丸ボタンが選択状態の場合
      if (this.selectedButtonList.length === 3) {
        // 現在の演算数を取得する
        this.currentCalculateCount = this.getCalculateCount();
        
        // 選択状態の丸ボタンを計算する
        this.calculatedResultValue = this.calculateNumber(this.selectedButtonList[0], this.selectedButtonList[2], this.selectedButtonList[1]);

        // 正解している場合
        if (this.currentCalculateCount === 2 && this.calculatedResultValue === '10') {
          this.stopTImer(); // タイマーストップ
        }
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
    // 正解している場合はリセットできない
    if (this.currentCalculateCount === 2 && this.calculatedResultValue === '10') {
      return;
    }
    this.resetExecute(false); // リセット実行
  }

  /**
   * 正解アニメーション終了イベント
   */
  public onAnimationEndAnswerEffect(): void {
    this.isStartAnswerEffect = false; // フラグを戻す
    
    // 最終問題が終了した場合
    if (this.questionCounter === this.MaxQuestionCount) {
      // TODO: 記録をバックエンドに送信
      // TODO: ランキング画面に遷移する

      // タイムを設定する
      this.storageService.setScore(this.time);

      // ホーム画面に遷移する
      this.changeComponentService.changePage(PAGE_ADDRESS.HOME);

      // TODO: リザルトダイアログを表示する

      return;
    }

    this.questionCounter++; // 次の問題を設定する
    this.resetExecute(false); // リセット実行
  }

  // region Private Method

  /**
   * 問題を生成する
   */
  private createQuestionList(): MakeTenQuestion[] {
    // 出題する問題のインデックスをランダム生成
    const indexList: number[] = [];
    while (indexList.length < this.MaxQuestionCount) {
      const index = Math.floor(Math.random() * MakeTenQuestionList.length);
      // 重複していない場合のみインデックスリストに追加
      if (!indexList.includes(index)) {
        indexList.push(index);
      }
    }

    const questionList: MakeTenQuestion[] = [];
    indexList.forEach((index) => {
      // 問題の数字配列をFisher-Yatesシャッフルアルゴリズムでシャッフルする
      const questionValues = [...MakeTenQuestionList[index].question];
      for (let i = questionValues.length - 1; i > 0; i--) {
        // 0 以上 i 以下のランダムな整数を取得
        let j = Math.floor(Math.random() * (i + 1));
        
        // 要素を交換する
        [questionValues[i], questionValues[j]] = [questionValues[j], questionValues[i]];
      }

      questionList.push({ question: questionValues, answer: MakeTenQuestionList[index].answer});
    });

    return questionList;
  }

  /**
   * タイマーをスタートさせる
   */
  private startTimer(): void {
    // 最大タイムを超えている場合
    if (this.time >= MaxTime) {
      return;
    }
    // 既にタイマーをスタートしている場合
    else if (this.isRunningTimer) {
      return;
    }

    const startTime: number = Date.now() - this.time;
    this.timerId = window.setInterval(() => {
      this.time = Date.now() - startTime;
      if (this.time >= MaxTime) {
        this.stopTImer();
      }
    }, 1);
    this.isRunningTimer = true;
  }

  /**
   * タイマーをストップさせる
   */
  private stopTImer(): void {
    window.clearInterval(this.timerId);
    this.isRunningTimer = false;
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
   * リセットを実行する
   * @param isPageVisible ページ表示時か否か
   */
  private resetExecute(isPageVisible: boolean): void {
    this.selectedButtonList.length = 0; // 丸ボタンをすべて非選択状態にする
    this.currentCalculateCount = 0; // 現在の演算数をリセット
    this.calculatedResultValue = null; // 計算結果をリセット

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
    this.circleButtonParams.numberFirst.label = this.questionList[this.questionCounter - 1].question[0].toString();
    this.circleButtonParams.numberSecond.label = this.questionList[this.questionCounter - 1].question[1].toString();
    this.circleButtonParams.numberThird.label = this.questionList[this.questionCounter - 1].question[2].toString();
    this.circleButtonParams.numberFourth.label = this.questionList[this.questionCounter - 1].question[3].toString();

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

      // Make10画面遷移時の場合
      if (isPageVisible) {
        // 丸ボタンを初期位置に配置完了後
        setTimeout(() => {
          this.circleButtonParams.transition = this.CircleButtonTransition; // 丸ボタンのアニメーション速度を変更（最初だけ遅い）
          this.startTimer(); // タイマーをスタートする
        }, this.InitCircleButtonTransitionTime);
      }
      else {
        // リセットによる初期位置への配置完了後
        setTimeout(() => {
          this.startTimer(); // タイマーをスタートする
        }, this.CircleButtonTransitionTime)
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
        // 演算アニメーションが終了状態の場合、待機後に丸ボタンを中央に集めるアニメーションを実行する
        if (transitionendEvent.propertyName === 'top' && this.calculateAnimationCondition === CALCULATE_ANIMATION_CONDITION.FINISH) {
          this.calculateAnimationCondition = CALCULATE_ANIMATION_CONDITION.WAIT_START;
          window.setTimeout(() => {
            // 選択状態の丸ボタンを中央に集める
            this.setCircleButtonPosition(this.selectedButtonList[0], this.positionInCircleButtonArea.selectThree.second);
            this.setCircleButtonPosition(this.selectedButtonList[2], this.positionInCircleButtonArea.selectThree.second);
            this.calculateAnimationCondition = CALCULATE_ANIMATION_CONDITION.START;
          }, this.StartCalculateAnimationWaitTime);
        }
        // 選択状態の丸ボタンを中央に集めるアニメーションが終了した場合、計算結果に応じて各処理を行う
        else if (transitionendEvent.propertyName === 'left' && this.calculateAnimationCondition === CALCULATE_ANIMATION_CONDITION.START) {
          this.calculateAnimationCondition = CALCULATE_ANIMATION_CONDITION.FINISH;
          
          // 選択状態の丸ボタンを全て非表示にする
          this.selectedButtonList.forEach((targetButton: CIRCLE_BUTTON_TYPE) => {
            this.setIsVisibleCircleButton(targetButton, false);
          });

          // 計算結果の分母が0の場合
          if (this.calculatedResultValue === null) {
            this.resetExecute(false); // リセット実行
            return;
          }
          
          // 算出された数字ボタンの表示をする
          if (this.currentCalculateCount === 0) {
            // 1つ目の算出された数字ボタンを表示する
            this.circleButtonParams.calculatedNumberFirst.isVisible = true;
            this.circleButtonParams.calculatedNumberFirst.label = this.calculatedResultValue;
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
          else if (this.currentCalculateCount === 1) {
            // 2つ目に算出された数字ボタンを表示する
            this.circleButtonParams.calculatedNumberSecond.isVisible = true;
            this.circleButtonParams.calculatedNumberSecond.label = this.calculatedResultValue;
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
          else if (this.currentCalculateCount === 2) {
            // 3つ目に算出された数字ボタン（回答）を表示する
            this.circleButtonParams.calculatedNumberThird.isVisible = true;
            this.circleButtonParams.calculatedNumberThird.label = this.calculatedResultValue;

            // 正誤判定
            if (this.calculatedResultValue === '10') {
              this.isStartAnswerEffect = true; // 正解アニメーション実行
            }
            else {
              window.setTimeout(() => {
                this.resetExecute(false); // リセット実行
              }, this.AnswerAfterWaitTime);
            }
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

  /**
     * 与えられた数字を計算する
     * @param firstNumberButton - 1つ目の数字ボタン
     * @param secondNumberButton - 2つ目の数字ボタン
     * @param operatorButton - 演算子ボタン
     * @returns 計算結果 ※ただし分母が0となる場合にはnullを返す
     */
  private calculateNumber(
    firstNumberButton: CIRCLE_BUTTON_TYPE,
    secondNumberButton: CIRCLE_BUTTON_TYPE,
    operatorButton: CIRCLE_BUTTON_TYPE
  ): string | null {
    let result: string | null = null; // 計算結果

    // 数字ボタンに設定されているラベルを取得
    const firstNumberButtonLabel = this.getNumberButtonLabel(firstNumberButton);
    const secondNumberButtonLabel = this.getNumberButtonLabel(secondNumberButton);

    // 値の文字列を数字の配列に変換
		const firstNumberArray = this.convertStringValueToNumberArray(firstNumberButtonLabel);
		const secondNumberArray = this.convertStringValueToNumberArray(secondNumberButtonLabel);

    if (operatorButton === CIRCLE_BUTTON_TYPE.PLUS) {
      result = this.calculatePlus(firstNumberArray, secondNumberArray);
    }
    else if (operatorButton === CIRCLE_BUTTON_TYPE.MINUS) {
      result = this.calculateMinus(firstNumberArray, secondNumberArray);
    }
    else if (operatorButton === CIRCLE_BUTTON_TYPE.MULTIPLIED_BY) {
      result = this.calculateMultipliedBy(firstNumberArray, secondNumberArray);
    }
    else if (operatorButton === CIRCLE_BUTTON_TYPE.DIVIDED_BY) {
      result = this.calculateDividedBy(firstNumberArray, secondNumberArray);
    }
    else {
      throw new Error(`[Make10] calculateNumber(${firstNumberButton}, ${secondNumberButton}, ${operatorButton}) : Unexpected argument set.`);
    }
    
    return result;
  }


  /**
   * 対象の数字ボタンのラベルを取得する
   * @param targetButton 対象の数字ボタン
   * @returns 数字ボタンに設定されているラベル
   */
  private getNumberButtonLabel(targetButton: CIRCLE_BUTTON_TYPE): string {
    if (targetButton === CIRCLE_BUTTON_TYPE.NUMBER_FIRST) {
      return this.circleButtonParams.numberFirst.label;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.NUMBER_SECOND) {
      return this.circleButtonParams.numberSecond.label;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.NUMBER_THIRD) {
      return this.circleButtonParams.numberThird.label;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.NUMBER_FOURTH) {
      return this.circleButtonParams.numberFourth.label;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_FIRST) {
      return this.circleButtonParams.calculatedNumberFirst.label;
    }
    else if (targetButton === CIRCLE_BUTTON_TYPE.CALCULATED_NUMBER_SECOND) {
      return this.circleButtonParams.calculatedNumberSecond.label;
    }
    throw new Error(`[Make10] getNumberButtonLabel(${targetButton}) : Unexpected argument set.`);
  }

  /**
   * string型の値（分数許容）をnumber型の配列に変換する（1/2 => [1, 2]）
   * @param targetValue 変換対象の値
   * @returns 変換結果
   */
  private convertStringValueToNumberArray(targetValue: string): number[] {
		const result: number[] = []; // 変換結果

    const slashIndex = targetValue.indexOf('/');

		// 分数の場合
		if (slashIndex >= 0) {
			result.push(Number(targetValue.substring(0, slashIndex))); // 分子を数字として格納
			result.push(Number(targetValue.substring(slashIndex + 1, targetValue.length))); // 分母を数字として格納
		}
		// 分数でない場合
		else {
			result.push(Number(targetValue));
		}

		return result;
  }

  /**
   * 足し算を行う
   * @param firstNumberArray 1つ目の数字の配列
   * @param secondNumberArray 2つ目の数字の配列
   * @returns 計算結果（文字列）
   */
  private calculatePlus(firstNumberArray: number[], secondNumberArray: number[]): string {
    // どちらも値が分数の場合
		if (firstNumberArray.length > 1 && secondNumberArray.length > 1) {
			// 分母の最小公倍数を求める
			const leastCommonMultiple = this.getLeastCommonMultiple(firstNumberArray[1], secondNumberArray[1]);
			// それぞれの分子を算出
			const firstChildNumber = firstNumberArray[0] * (leastCommonMultiple / firstNumberArray[1]);
			const secondChildNumber = secondNumberArray[0] * (leastCommonMultiple / secondNumberArray[1]);
			// 分子同士を足し算する
			const childNumber = firstChildNumber + secondChildNumber;
			// 約分した分数の文字列を取得
			const calculatedValue = this.getReduceFractions(childNumber, leastCommonMultiple);
      return calculatedValue;
		}
		// 1つ目の値が分数の場合
		else if (firstNumberArray.length > 1) {
			// 2つ目の数字の分子を1つ目の数字の分母に合わせた値にする（通分）
			const secondChildNumber = secondNumberArray[0] * firstNumberArray[1];
			// 分子同士を足し算する
			const childNumber = firstNumberArray[0] + secondChildNumber;
			// 約分した分数の文字列を取得
			const calculatedValue = this.getReduceFractions(childNumber, firstNumberArray[1]);
      return calculatedValue;
		}
		// 2つ目の値が分数の場合
		else if (secondNumberArray.length > 1) {
			// 1つ目の数字の分子を2つ目の数字の分母に合わせた値にする（通分）
			const firstChildNumber = firstNumberArray[0] * secondNumberArray[1];
			// 分子同士を足し算する
			const childNumber = firstChildNumber + secondNumberArray[0];
			// 約分した分数の文字列を取得
			const calculatedValue = this.getReduceFractions(childNumber, secondNumberArray[1]);
      return calculatedValue;
		}
		// どちらも値が分数でない場合
		else {
			const calculatedValue = String(firstNumberArray[0] + secondNumberArray[0]);
      return calculatedValue;
		}
  }

  /**
   * 引き算を行う
   * @param firstNumberArray 1つ目の数字の配列
   * @param secondNumberArray 2つ目の数字の配列
   * @returns 計算結果（文字列）
   */
  private calculateMinus(firstNumberArray: number[], secondNumberArray: number[]): string {
		// どちらも値が分数の場合
		if (firstNumberArray.length > 1 && secondNumberArray.length > 1) {
			// 分母の最小公倍数を求める
			const leastCommonMultiple = this.getLeastCommonMultiple(firstNumberArray[1], secondNumberArray[1]);
			// それぞれの分子を算出
			const firstChildNumber = firstNumberArray[0] * (leastCommonMultiple / firstNumberArray[1]);
			const secondChildNumber = secondNumberArray[0] * (leastCommonMultiple / secondNumberArray[1]);
			// 分子同士を引き算する
			const childNumber = firstChildNumber - secondChildNumber;
			// 約分した分数の文字列を取得
			const calculatedValue = this.getReduceFractions(childNumber, leastCommonMultiple);
      return calculatedValue;
		}
		// 1つ目の値が分数の場合
		else if (firstNumberArray.length > 1) {
			// 2つ目の数字の分子を1つ目の数字の分母に合わせた値にする（通分）
			const secondChildNumber = secondNumberArray[0] * firstNumberArray[1];
			// 分子同士を引き算する
			const childNumber = firstNumberArray[0] - secondChildNumber;
			// 約分した分数の文字列を取得
			const calculatedValue = this.getReduceFractions(childNumber, firstNumberArray[1]);
      return calculatedValue;
		}
		// 2つ目の値が分数の場合
		else if (secondNumberArray.length > 1) {
			// 1つ目の数字の分子を2つ目の数字の分母に合わせた値にする（通分）
			const firstChildNumber = firstNumberArray[0] * secondNumberArray[1];
			// 分子同士を引き算する
			const childNumber = firstChildNumber - secondNumberArray[0];
			// 約分した分数の文字列を取得
			const calculatedValue = this.getReduceFractions(childNumber, secondNumberArray[1]);
      return calculatedValue;
		}
		// どちらも値が分数でない場合
		else {
			const calculatedValue = String(firstNumberArray[0] - secondNumberArray[0]);
      return calculatedValue;
		}
  }

  /**
   * 掛け算を行う
   * @param firstNumberArray 1つ目の数字の配列
   * @param secondNumberArray 2つ目の数字の配列
   * @returns 計算結果（文字列）
   */
  private calculateMultipliedBy(firstNumberArray: number[], secondNumberArray: number[]): string {
		// どちらも値が分数の場合
		if (firstNumberArray.length > 1 && secondNumberArray.length > 1) {
			// 分子と分母をそれぞれ掛け算
			const childNumber = firstNumberArray[0] * secondNumberArray[0]; // 分子を計算
			const motherNumber = firstNumberArray[1] * secondNumberArray[1]; // 分母を計算 
			// 約分した分数の文字列を取得
			const calculatedValue = this.getReduceFractions(childNumber, motherNumber);
      return calculatedValue;
		}
		// 1つ目の値が分数の場合
		else if (firstNumberArray.length > 1) {
			const childNumber = firstNumberArray[0] * secondNumberArray[0] // 分子を計算
			// 約分した分数の文字列を取得
			const calculatedValue = this.getReduceFractions(childNumber, firstNumberArray[1]);
      return calculatedValue;
		}
		// 2つ目の値が分数の場合
		else if (secondNumberArray.length > 1) {
			const childNumber = firstNumberArray[0] * secondNumberArray[0]; // 分子を計算
			// 約分した分数の文字列を取得
			const calculatedValue = this.getReduceFractions(childNumber, secondNumberArray[1]);
      return calculatedValue;
		}
		// どちらも値が分数でない場合
		else {
			const calculatedValue = String(firstNumberArray[0] * secondNumberArray[0]);
      return calculatedValue;
		}
  }

  /**
   * 割り算を行う
   * @param firstNumberArray 1つ目の数字の配列
   * @param secondNumberArray 2つ目の数字の配列
   * @returns 計算結果（文字列） ※ただし分母が0となる場合にはnullを返す
   */
  private calculateDividedBy(firstNumberArray: number[], secondNumberArray: number[]): string | null {
    // 割る値が0の場合はnullを返す
    if (secondNumberArray.length === 1 && secondNumberArray[0] === 0) {
      return null;
    }

		// どちらも値が分数の場合
		if (firstNumberArray.length > 1 && secondNumberArray.length > 1) {
			// 逆数の掛け算
			const childNumber = firstNumberArray[0] * secondNumberArray[1]; // 分子を計算
			const motherNumber = firstNumberArray[1] * secondNumberArray[0]; // 分母を計算 
			// 約分した分数の文字列を取得
			const calculatedValue = this.getReduceFractions(childNumber, motherNumber);
      return calculatedValue;
		}
		// 割られる値が分数の場合
		else if (firstNumberArray.length > 1) {
			const motherNumber = firstNumberArray[1] * secondNumberArray[0] // 分母を計算
			// 約分した分数の文字列を取得
			const calculatedValue = this.getReduceFractions(firstNumberArray[0], motherNumber);
      return calculatedValue;
		}
		// 割る値が分数の場合
		else if (secondNumberArray.length > 1) {
			const childNumber = firstNumberArray[0] * secondNumberArray[1]; // 分子を計算
			// 約分した分数の文字列を取得
			const calculatedValue = this.getReduceFractions(childNumber, secondNumberArray[0]);
      return calculatedValue;
		}
		// どちらも値が分数でない場合
		else {
			// 割り切れる場合
			if (firstNumberArray[0] % secondNumberArray[0] === 0) {
				const calculatedValue = String(firstNumberArray[0] / secondNumberArray[0]);
        return calculatedValue;
			}
			// 分数となる場合
			else {
				// 約分した分数の文字列を取得
				const calculatedValue = this.getReduceFractions(firstNumberArray[0], secondNumberArray[0]);
        return calculatedValue;
			}
		}
  }

  /**
	 * 2つの数字の最小公倍数を算出する
	 * @param firstNumber 1つ目の数字
	 * @param secondNumber 2つ目の数字
	 * @returns 2つの数字の最小公倍数
	 */
	private getLeastCommonMultiple(firstNumber: number, secondNumber: number): number {
		let result = firstNumber * secondNumber; // 最小公倍数

		// 最小公倍数を探索する
		firstNumberMultiple: for (let i = 1; i <= secondNumber; i++) {
			for (let j = 1; j <= firstNumber; j++) {
				const first = firstNumber * i;
				const second = secondNumber * j;
				// 最小公倍数を見つけた場合
				if (first === second) {
					result = first;
					break firstNumberMultiple;
				}
				else if (first < second) {
					continue firstNumberMultiple;
				}
			}
		}

		return result;
	}

  /**
	 * 約分した分数の文字列を取得する
	 * @param childNumber 分子の値
	 * @param motherNumber 分母の値
	 * @returns 約分した分数の文字列
	 */
	private getReduceFractions(childNumber: number, motherNumber: number): string {
		// 分子の値が分母の値以下の場合
		const minValue = childNumber <= motherNumber ? childNumber : motherNumber;

		// 最大公約数を求める
		let greatestCommonDivisor = 1;
		for (let i = minValue; i > 1; i--) {
			// 最大公約数の場合
			if (childNumber % i === 0 && motherNumber % i === 0) {
				greatestCommonDivisor = i; // 最大公約数を更新
				break;
			}
		}
		
    const calculatedMotherNumber = motherNumber / greatestCommonDivisor;
    // 分母が1となる場合
		if (calculatedMotherNumber === 1) {
			return String(childNumber / greatestCommonDivisor);
		}

		return `${childNumber / greatestCommonDivisor}/${calculatedMotherNumber}`;
	}

  /**
   * ギブアップダイアログを表示する
   */
  private openGiveUpDialog(): void {
    // ダイアログを表示する
    const dialogRef = this.dialog.open(GiveUpDialogComponent, {
      disableClose: true // ダイアログ外を押下しても閉じないように設定
    });

    // ダイアログを閉じた際のイベント
    dialogRef.afterClosed().subscribe((isGiveUp: boolean) => {
      if (isGiveUp) {
        // ホーム画面に表示する答えを設定する
        const answer = this.questionList[this.questionCounter - 1].answer;
        this.storageService.setGiveUpAnswer(answer);

        // ホーム画面に遷移する
        this.changeComponentService.changePage(PAGE_ADDRESS.HOME);
      }
    });
  }
}

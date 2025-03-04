import { AfterViewInit, Component, inject } from '@angular/core';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { PAGE_ADDRESS } from '../../../app.routes';
import { SQUARE_BUTTON_COLOR, SquareButtonComponent } from '../../share/square-button/square-button.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { StorageService } from '../../../core/services/storage.service';
import { ApplicationVersion } from '../../../core/constants';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { SnackBarComponent, SnackBarData } from '../../share/snack-bar/snack-bar.component';

/**
 * ホーム画面コンポーネント
 * @class
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SquareButtonComponent,
    AngularSvgIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent implements AfterViewInit {
  private readonly storageService = inject(StorageService); // ストレージサービス

  public readonly SquareButtonColor = SQUARE_BUTTON_COLOR;
  public readonly Version = ApplicationVersion;
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  
  public isFocusPlayerNameInputForm: boolean = false;
  public giveUpAnswer: string = ''; // ギブアップ時に表示する答え（空文字の場合は非表示）

  /**
   * @constructor
   * @param changeComponentService 画面コンポーネント切替サービス
   */
  constructor(
    private changeComponentService: ChangeComponentService,
  ) {
    // 設定されているギブアップの答えを取得する
    this.giveUpAnswer = this.storageService.getGiveUpAnswer();
  }

  // region LifeCycle Method

  /**
   * ライフサイクル: ビュー表示後
   */
  public ngAfterViewInit(): void {
    // 登録されているプレイヤー名を設定する
    const playerNameInputFormElement = document.getElementById('user-name') as HTMLInputElement;
    playerNameInputFormElement.value = this.storageService.playerName;
  }

  // region Public Method

  /**
   * プレイヤー名入力欄へのフォーカスイベント
   * @param isFocus フォーカスされたか否か
   */
  public onFocusPlayerNameInputForm(isFocus: boolean): void {
    this.snackBar.dismiss(); // スナックバーを閉じる    
    this.isFocusPlayerNameInputForm = isFocus;

    // 入力欄からフォーカスが外れた場合
    if (!isFocus) {
      // 入力されたプレイヤー名の整形を行う
      const playerNameInputFormElement = document.getElementById('user-name') as HTMLInputElement;
      playerNameInputFormElement.value = this.storageService.registerPlayerName(playerNameInputFormElement.value);
    }
  }

  /**
   * STARTボタンクリックイベント
   */
  public onClickStartButton(): void {
    // プレイヤー名が未設定の場合、未設定メッセージを表示する
    if (this.storageService.playerName.length === 0) {
      const snackBarData: SnackBarData = new SnackBarData(
        'Please enter a Player Name.'
      );
      const snackBarConfig: MatSnackBarConfig = {
        duration: 5000,
        horizontalPosition: 'center',
        verticalPosition: 'bottom',
        data: snackBarData,
      };
      this.snackBar.openFromComponent(SnackBarComponent, snackBarConfig);
    }
    else {
      this.changeComponentService.changePage(PAGE_ADDRESS.MAKE_TEN);
    }
  }

  /**
   * RANKINGボタンクリックイベント
   */
  public onClickRankingButton(): void {
    this.changeComponentService.changePage(PAGE_ADDRESS.RANKING);
  }

  /**
   * HowToPlayボタンクリックイベント
   */
  public onClickHowToPlayButton(): void {
    this.changeComponentService.changePage(PAGE_ADDRESS.HOW_TO);
  }
}

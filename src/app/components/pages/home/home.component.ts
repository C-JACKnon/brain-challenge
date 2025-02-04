import { AfterViewInit, Component } from '@angular/core';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { PAGE_ADDRESS } from '../../../app.routes';
import { SQUARE_BUTTON_COLOR, SquareButtonComponent } from '../../share/square-button/square-button.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { PlayerNameService } from '../../../core/services/player-name.service';
import { MakeTenNotificationService } from '../../../core/services/make-ten-notification.service';

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
  public readonly SquareButtonColor = SQUARE_BUTTON_COLOR;
  
  public isFocusPlayerNameInputForm: boolean = false;
  public giveUpAnswer: string = '';

  /**
   * @constructor
   * @param changeComponentService 画面コンポーネント切替サービス
   * @param playerNameService プレイヤー名サービス
   * @param makeTenNotificationService Make10用の通知サービス
   */
  constructor(
    private changeComponentService: ChangeComponentService,
    private playerNameService: PlayerNameService,
    private makeTenNotificationService: MakeTenNotificationService,
  ) {
    // 設定されているギブアップの答えを取得する
    this.giveUpAnswer = this.makeTenNotificationService.getGiveUpAnswer();
  }

  /**
   * ライフサイクル: ビュー表示後
   */
  public ngAfterViewInit(): void {
    // 登録されているプレイヤー名を設定する
    const playerNameInputFormElement = document.getElementById('user-name') as HTMLInputElement;
    playerNameInputFormElement.value = this.playerNameService.playerName;
  }

  /**
   * プレイヤー名入力欄へのフォーカスイベント
   * @param isFocus フォーカスされたか否か
   */
  public onFocusPlayerNameInputForm(isFocus: boolean): void {
    this.isFocusPlayerNameInputForm = isFocus;

    // 入力欄からフォーカスが外れた場合
    if (!isFocus) {
      // 入力されたプレイヤー名の整形を行う
      const playerNameInputFormElement = document.getElementById('user-name') as HTMLInputElement;
      playerNameInputFormElement.value = this.playerNameService.registerPlayerName(playerNameInputFormElement.value);
    }
  }

  /**
   * STARTボタンクリックイベント
   */
  public onClickStartButton(): void {
    this.changeComponentService.changePage(PAGE_ADDRESS.MAKE_TEN);
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

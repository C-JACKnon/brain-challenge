import { AfterViewInit, Component } from '@angular/core';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { PAGE_ADDRESS } from '../../../app.routes';
import { SquareButtonComponent } from '../../share/square-button/square-button.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';
import { PlayerNameService } from '../../../core/services/player-name.service';

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
  public isFocusPlayerNameInputForm: boolean = false;

  /**
   * @constructor
   * @param changeComponentService 画面コンポーネント切替サービス
   * @param playerNameService プレイヤー名サービス
   */
  constructor(
    private changeComponentService: ChangeComponentService,
    private playerNameService: PlayerNameService,
  ) { }

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

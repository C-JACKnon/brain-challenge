import { Component } from '@angular/core';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { PAGE_ADDRESS } from '../../../app.routes';
import { SquareButtonComponent } from '../../share/square-button/square-button.component';
import { AngularSvgIconModule } from 'angular-svg-icon';

/**
 * ホーム画面コンポーネント
 * @class
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    SquareButtonComponent,
    AngularSvgIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  /**
   * @constructor
   * @param changeComponentService 画面コンポーネント切替サービス
   */
  constructor(
    private changeComponentService: ChangeComponentService,
  ) { }

  /**
   * 設定ボタンクリックイベント
   */
  public onClickSettingsButton(): void {
    // TODO: 設定画面遷移処理の実装
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

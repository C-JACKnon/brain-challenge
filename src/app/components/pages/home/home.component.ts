import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { ButtonModule } from 'primeng/button';
import { PAGE_ADDRESS } from '../../../app.routes';

/**
 * ホーム画面コンポーネント
 * @class
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
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
   * プレイボタンクリックイベント
   */
  public onClickPlayButton(): void {
    this.changeComponentService.changePage(PAGE_ADDRESS.HOW_TO);
  }

  /**
   * ランキングボタンクリックイベント
   */
  public onClickRankingButton(): void {
    this.changeComponentService.changePage(PAGE_ADDRESS.HOW_TO);
  }
}

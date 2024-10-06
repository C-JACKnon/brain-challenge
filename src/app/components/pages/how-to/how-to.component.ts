import { Component } from '@angular/core';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { PAGE_ADDRESS } from '../../../app.routes';

/**
 * 遊び方画面コンポーネント
 * @class
 */
@Component({
  selector: 'app-how-to',
  standalone: true,
  imports: [],
  templateUrl: './how-to.component.html',
  styleUrl: './how-to.component.scss'
})
export class HowToComponent {
  /**
   * @constructor
   * @param changeComponentService 画面コンポーネント切替サービス
   */
  constructor(
    private changeComponentService: ChangeComponentService,
  ) { }

  /**
   * 戻るボタン押下イベント
   */
  public onClickReturnButton(): void {
    this.changeComponentService.changePage(PAGE_ADDRESS.HOME);
  }
}

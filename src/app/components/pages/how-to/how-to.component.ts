import { Component, inject } from '@angular/core';
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
  private readonly changeComponentService = inject(ChangeComponentService); // 画面コンポーネント切替サービス

  /**
   * 戻るボタン押下イベント
   */
  public onClickReturnButton(): void {
    this.changeComponentService.changePage(PAGE_ADDRESS.HOME);
  }
}

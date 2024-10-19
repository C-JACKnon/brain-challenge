import { Component } from '@angular/core';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { PAGE_ADDRESS } from '../../../app.routes';

/**
 * 設定画面コンポーネント
 * @class
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
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

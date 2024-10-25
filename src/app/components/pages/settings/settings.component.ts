import { Component } from '@angular/core';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { SettingsService } from '../../../core/services/settings.service';
import { PAGE_ADDRESS } from '../../../app.routes';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ToggleButtonComponent } from '../../share/toggle-button/toggle-button.component';

/**
 * 設定画面コンポーネント
 * @class
 */
@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    ToggleButtonComponent,
    AngularSvgIconModule,
  ],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  /**
   * @constructor
   * @param changeComponentService 画面コンポーネント切替サービス
   * @param settingsService 設定サービス
   */
  constructor(
    private changeComponentService: ChangeComponentService,
    public settingsService: SettingsService,
  ) { }

  /**
   * タイマートグルボタン押下イベント
   * @param isOn ONか否か
   */
  public onClickTimerToggleButton(isOn: boolean): void {
    this.settingsService.isVisibleTimer = isOn;
  }

  /**
   * 閉じるボタン押下イベント
   */
  public onClickCloseButton(): void {
    this.changeComponentService.changePage(PAGE_ADDRESS.HOME);
  }
}

import { Component, inject } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { PAGE_ADDRESS } from '../../../app.routes';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { MyScoreComponent } from './unique-components/my-score/my-score.component';
import { OnlineScoreComponent } from './unique-components/online-score/online-score.component';

/**
 * スコア画面コンポーネント
 * @class
 */
@Component({
  selector: 'app-score',
  standalone: true,
  imports: [
    CommonModule,
    AngularSvgIconModule,
    MatTabsModule,
    MyScoreComponent,
    OnlineScoreComponent
  ],
  templateUrl: './score.component.html',
  styleUrl: './score.component.scss'
})
export class ScoreComponent {
  private readonly changeComponentService = inject(ChangeComponentService); // 画面コンポーネント切替サービス
  
  public selectTabIndex: number = 0; // 選択中のタブのインデックス

  // region Public Method

  /**
   * 戻るボタン押下イベント
   */
  public onClickReturnButton(): void {
    this.changeComponentService.changePage(PAGE_ADDRESS.HOME);
  }

  /**
   * タブ選択イベント
   * @param selectTabIndex 選択したタブのインデックス
   */
  public onSelectTab(selectTabIndex: number): void {
    this.selectTabIndex = selectTabIndex;
  }
}

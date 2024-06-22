import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PageComponentsType } from '../../../core/types/page-components.enum';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    FormsModule,
    ButtonModule,
    InputSwitchModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent  {
  public isVisibleTimer: boolean = true;

  constructor(
    private changeComponentService: ChangeComponentService,
  ) { }

  /**
   * プレイボタンクリックイベント
   */
  public onClickPlayButton(): void {
    this.changeComponentService.changePage(PageComponentsType.HowTo);
  }

  /**
   * ランキングボタンクリックイベント
   */
  public onClickRankingButton(): void {
    this.changeComponentService.changePage(PageComponentsType.Ranking);
  }

  /**
   * タイマー表示変更ラベルクリックイベント
   */
  public onClickChangeVisibleTimerLabel(): void {
    this.isVisibleTimer = !this.isVisibleTimer;
  }
}

import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { ButtonModule } from 'primeng/button';
import { InputSwitchModule } from 'primeng/inputswitch';
import { PAGE_ADDRESS } from '../../../app.routes';

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
    this.changeComponentService.changePage(PAGE_ADDRESS.HOW_TO);
  }

  /**
   * ランキングボタンクリックイベント
   */
  public onClickRankingButton(): void {
    this.changeComponentService.changePage(PAGE_ADDRESS.RANKING);
  }

  /**
   * タイマー表示変更ラベルクリックイベント
   */
  public onClickChangeVisibleTimerLabel(): void {
    this.isVisibleTimer = !this.isVisibleTimer;
  }
}

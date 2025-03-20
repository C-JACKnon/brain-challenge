import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { StorageService } from '../../../../../core/services/storage.service';
import { ScoreTimePipe } from '../../../../../core/pipe/score-time.pipe';
import { TodayScoreMaxCount } from '../../../../../core/constants';
import { TodayScore } from '../../../../../core/models';

/**
 * 自己スコアコンポーネント
 * @class
 */
@Component({
  selector: 'my-score',
  standalone: true,
  imports: [
    CommonModule,
    ScoreTimePipe,
  ],
  templateUrl: './my-score.component.html',
  styleUrl: './my-score.component.scss'
})
export class MyScoreComponent implements OnInit {
  public readonly storageService = inject(StorageService);

  public bestScore: number | null = null;
  public todayScore: TodayScore = {
    date: '',
    score: []
  };
  // [0, 1, ..., 9]の配列
  public todayScoreMaxCountArray: number[] = [...Array(TodayScoreMaxCount)].map((x, i) => i);
  
  // region LifeCycle Method

  /**
   * ライフサイクル: 初期処理
   */
  public ngOnInit(): void {
    // スコアの日付を確認する
    this.storageService.checkTodayScoreDate();
    this.bestScore = this.storageService.bestScore;
    this.todayScore = structuredClone(this.storageService.todayScore); // ディープコピー
  }
}

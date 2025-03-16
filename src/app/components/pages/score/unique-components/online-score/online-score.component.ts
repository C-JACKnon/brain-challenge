import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { StorageService } from '../../../../../core/services/storage.service';
import { ScoreTimePipe } from "../../../../../core/pipe/score-time.pipe";
import { TodayScoreMaxCount } from '../../../../../core/constants';

/**
 * プレイヤー情報
 */
export type PlayerInfo = {
  id: string,
  name: string,
  score: number,
}

/**
 * オンラインスコアコンポーネント
 * @class
 */
@Component({
  selector: 'online-score',
  standalone: true,
  imports: [
    CommonModule,
    ScoreTimePipe
  ],
  templateUrl: './online-score.component.html',
  styleUrl: './online-score.component.scss'
})
export class OnlineScoreComponent implements OnInit {
  public readonly storageService = inject(StorageService);
  
  public date: string = '';
  public onlineScore: PlayerInfo[] = [];

  // [0, 1, ..., 9]の配列
  public todayScoreMaxCountArray: number[] = [...Array(TodayScoreMaxCount)].map((x, i) => i);
  
  // region LifeCycle Method

  /**
   * ライフサイクル: 初期処理
   */
  public ngOnInit(): void {
    // 日付を設定する
    this.date = this.storageService.todayScore.date;

    // TODO: サーバからオンラインスコアを取得する
    this.onlineScore = [
      { id: 'aaa', name: 'マンチカン', score: 1111 },
      { id: 'bbb', name: 'ぺるしゃ', score: 2222 },
      { id: 'ccc', name: 'あいうえおかきくけこさしすせそ', score: 3333 },
      { id: 'ddd', name: 'ドカべソ', score: 4444 },
      { id: '1il9tmjhu1e3os5i78tn', name: 'test', score: 5414 },
      { id: 'eee', name: 'Online Score', score: 5555 },
      { id: 'fff', name: 'メイク天男', score: 6666 },
      { id: 'ggg', name: 'シュプリーム大スキーム', score: 7777 },
      { id: 'ggg', name: 'あいうえおかきくけこさしすせそ', score: 8888 }
    ];
  }
}

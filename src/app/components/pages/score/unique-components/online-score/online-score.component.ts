import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { StorageService } from '../../../../../core/services/storage.service';
import { ScoreTimePipe } from "../../../../../core/pipe/score-time.pipe";
import { TodayScoreMaxCount } from '../../../../../core/constants';
import { HttpService } from '../../../../../core/services/http.service';
import { GetOnlineScoreResponse, PlayerInfo } from '../../../../../core/models';
import { HttpStatusCode } from '@angular/common/http';
import { SnackBarComponent, SnackBarData } from '../../../../share/snack-bar/snack-bar.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { NgWordScanPipe } from "../../../../../core/pipe/ng-word-scan.pipe";

/**
 * オンラインスコアコンポーネント
 * @class
 */
@Component({
  selector: 'online-score',
  standalone: true,
  imports: [
    CommonModule,
    ScoreTimePipe,
    NgWordScanPipe
],
  templateUrl: './online-score.component.html',
  styleUrl: './online-score.component.scss'
})
export class OnlineScoreComponent implements OnInit {
  public readonly storageService = inject(StorageService);
  private readonly httpService = inject(HttpService);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);
  
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

    // サーバからオンラインスコアを取得する
    this.httpService.getOnlineScore()
    .subscribe({
      next: (response: GetOnlineScoreResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.onlineScore = response.ranking;
        }
        else {
          console.error(`StatusCode: ${response.status} message: ${response.message}`);
        }
      },
      error: (err) => {
        console.error(err);
        const snackBarData: SnackBarData = new SnackBarData(
          'Failed to get Online Score.'
        );
        const snackBarConfig: MatSnackBarConfig = {
          duration: 5000,
          horizontalPosition: 'center',
          verticalPosition: 'bottom',
          data: snackBarData,
        };
        this.snackBar.openFromComponent(SnackBarComponent, snackBarConfig);
      }
    });
  }
}

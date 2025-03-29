import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { StorageService } from '../../../../../core/services/storage.service';
import { ScoreTimePipe } from "../../../../../core/pipe/score-time.pipe";
import { NgWordList, TodayScoreMaxCount } from '../../../../../core/constants';
import { HttpService } from '../../../../../core/services/http.service';
import { GetOnlineScoreResponse, OnlineScore } from '../../../../../core/models';
import { HttpStatusCode } from '@angular/common/http';
import { SnackBarComponent, SnackBarData } from '../../../../share/snack-bar/snack-bar.component';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { AngularSvgIconModule } from 'angular-svg-icon';

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
    AngularSvgIconModule,
  ],
  templateUrl: './online-score.component.html',
  styleUrl: './online-score.component.scss'
})
export class OnlineScoreComponent implements OnInit {
  public readonly storageService = inject(StorageService);
  private readonly httpService = inject(HttpService);
  private readonly snackBar: MatSnackBar = inject(MatSnackBar);

  public onlineScoreList: OnlineScore[] = [];
  public daySelectButtonLabels: string[] = [];
  public daySelectIndex: number = 0;

  // [0, 1, ..., 9]の配列
  public todayScoreMaxCountArray: number[] = [...Array(TodayScoreMaxCount)].map((x, i) => i);

  
  // region LifeCycle Method

  /**
   * ライフサイクル: 初期処理
   */
  public ngOnInit(): void {
    // サーバからオンラインスコアを取得する
    this.httpService.getOnlineScore()
    .subscribe({
      next: (response: GetOnlineScoreResponse) => {
        if (response.status === HttpStatusCode.Ok) {
          this.onlineScoreList = response.rankingList;
          // プレイヤー名のNGワードを伏字にする
          for (let i = 0; i < this.onlineScoreList.length; i++) {
            for (let j = 0; j < this.onlineScoreList[i].ranking.length; j++) {
              this.onlineScoreList[i].ranking[j].name = this.fixPlayerName(this.onlineScoreList[i].ranking[j].name);
            }
            this.daySelectButtonLabels.push(this.onlineScoreList[i].date.substring(5)); // yyyy/M/d → M/d に変換 
          }
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

  /**
   * 日付選択ボタン押下イベント
   * @param index 押下されたボタンのインデックス
   */
  public onClickDaySelectButton(index: number): void {
    this.daySelectIndex = index;
  }

  /**
   * プレイヤーミュートボタン押下イベント
   * @param playerId ミュートボタンを押下されたプレイヤーID
   */
  public onClickMuteButton(playerId: string): void {
    // 既にミュート済みのプレイヤーの場合、ミュートを解除する
    if (this.storageService.muteList.includes(playerId)) {
      this.storageService.removeMuteList(playerId);
    }
    // ミュートする
    else {
      this.storageService.addMuteList(playerId);
    }
  }

  /**
   * プレイヤー名のNGワードを変換する
   * @param playerName 入力値
   * @returns 変換後の値
   */
  private fixPlayerName(playerName: string): string {
    let fixedPlayerName = playerName;
    NgWordList.hira.forEach((word: string) => {
      fixedPlayerName = fixedPlayerName.replaceAll(word, '*');
    });
    NgWordList.kan.forEach((word: string) => {
      fixedPlayerName = fixedPlayerName.replaceAll(word, '*');
    });
    NgWordList.kata.forEach((word: string) => {
      fixedPlayerName = fixedPlayerName.replaceAll(word, '*');
    });
    NgWordList.hankaku.forEach((word: string) => {
      fixedPlayerName = fixedPlayerName.replaceAll(word, '*');
    });
    NgWordList.mix.forEach((word: string) => {
      fixedPlayerName = fixedPlayerName.replaceAll(word, '*');
    });
    NgWordList.roma.forEach((word: string) => {
      fixedPlayerName = fixedPlayerName.replaceAll(word, '*');
      fixedPlayerName = fixedPlayerName.replaceAll(word.toLowerCase(), '*');
      fixedPlayerName = fixedPlayerName.replaceAll(word.toUpperCase(), '*');
    });
    NgWordList.en.forEach((word: string) => {
      fixedPlayerName = fixedPlayerName.replaceAll(word, '*');
      fixedPlayerName = fixedPlayerName.replaceAll(word.toLowerCase(), '*');
      fixedPlayerName = fixedPlayerName.replaceAll(word.toUpperCase(), '*');
    });fixedPlayerName
    NgWordList.num.forEach((word: string) => {
      fixedPlayerName = fixedPlayerName.replaceAll(word, '*');
    });
    
    return fixedPlayerName;
  }
}

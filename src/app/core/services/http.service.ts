import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { GetOnlineScoreResponse, PlayerInfo, PostScoreResponse } from '../models';
import { StorageService } from './storage.service';

/**
 * HTTP通信サービス
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class HttpService {
  private http: HttpClient = inject(HttpClient);
  private storageService: StorageService = inject(StorageService);
  private options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    }),
  };

  /**
   * オンラインスコアを取得する
   * @returns オンラインスコア
   */
  public getOnlineScore(): Observable<GetOnlineScoreResponse> {
    return this.http.get<GetOnlineScoreResponse>(
      `${environment.serverAddress}/ranking`,
      this.options
    );
  }

  /**
   * スコアを登録する
   * @param score 登録するスコア
   * @returns 
   */
  public postScore(score: number): Observable<PostScoreResponse> {
    const body: PlayerInfo = {
      id: this.storageService.id,
      name: this.storageService.playerName,
      score: score,
    };
    return this.http.post<PostScoreResponse>(
      `${environment.serverAddress}/score`,
      JSON.stringify(body),
      this.options
    );
  }
}

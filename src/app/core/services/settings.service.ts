import { Injectable } from '@angular/core';

/**
 * 設定サービス
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  // タイマー表示設定
  private _isVisibleTimer: boolean = true;
  public get isVisibleTimer(): boolean {
    return this._isVisibleTimer;
  }
  public set isVisibleTimer(isVisible: boolean) {
    this._isVisibleTimer = isVisible;
  }
}

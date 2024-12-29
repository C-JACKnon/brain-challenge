import { Injectable } from '@angular/core';
import { DisplaySize } from '../interfaces/display-size.interface';
import { Observable, Subject } from 'rxjs';

/**
 * 画面サイズ管理サービス
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class DisplaySizeManagementService {
  // このゲームが対応する最小の画面サイズ
  private readonly MinSupportDisplaySize = 
  { 
    height: 660,
    width: 340
  } as const;

  // このゲームが対応する最大の画面サイズ
  // Figmaで定義した画面サイズ（ワイのiPhone14画面サイズ）
  private readonly MaxSupportDisplaySize = 
  { 
    height: 844,
    width: 390
  } as const;

  // 画面に対して表示するアプリケーションのサイズ
  private _applicationSize: DisplaySize = 
  {
    height: this.MinSupportDisplaySize.height,
    width: this.MinSupportDisplaySize.width,
  }
  public get applicationSize(): DisplaySize {
    return this._applicationSize;
  }

  // アプリケーションサイズ変更通知
  private _applicationResizeNotification: Subject<DisplaySize> = new Subject<DisplaySize>();
  public applicationResizeNotification: Observable<DisplaySize> = this._applicationResizeNotification.asObservable();

  /**
   * アプリケーションサイズの更新
   * @returns 新たに設定したアプリケーションサイズ
   */
  public updateApplicationSize(): DisplaySize {
    const displaySize: DisplaySize = {
      height: window.innerHeight,
      width: window.innerWidth,
    };

    if (displaySize.height < this.MinSupportDisplaySize.height) {
      this._applicationSize.height = this.MinSupportDisplaySize.height;
    }
    else if (displaySize.height > this.MaxSupportDisplaySize.height) {
      this._applicationSize.height = this.MaxSupportDisplaySize.height;
    }
    else {
      this._applicationSize.height = displaySize.height;
    }

    if (displaySize.width < this.MinSupportDisplaySize.width) {
      this._applicationSize.width = this.MinSupportDisplaySize.width;
    }
    else if (displaySize.width > this.MaxSupportDisplaySize.width) {
      this._applicationSize.width = this.MaxSupportDisplaySize.width;
    }
    else {
      this._applicationSize.width = displaySize.width;
    }

    // リサイズを通知
    this._applicationResizeNotification.next(this._applicationSize);

    return this._applicationSize;
  }
}

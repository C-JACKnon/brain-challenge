import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { PAGE_ADDRESS } from '../../app.routes';
import { Observable, Subject } from 'rxjs';

/**
 * 画面コンポーネント切替サービス
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class ChangeComponentService {
  private readonly router = inject(Router); // Angularのルータクラス

  // 現在の画面
  private currentPage: PAGE_ADDRESS = PAGE_ADDRESS.LOADING; // 起動時にHOME→HOMEにならないように初期値をLOADINGにする

  // 画面遷移の通知
  private _changePageNotification: Subject<PAGE_ADDRESS> = new Subject<PAGE_ADDRESS>();
  public changePageNotification: Observable<PAGE_ADDRESS> = this._changePageNotification.asObservable();

  /**
   * @constructor
   */
  constructor() {
    // 同じ画面に遷移する場合、コンポーネントを再読み込みする設定
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
  }

  /**
   * 表示する画面の変更
   * @param nextPageAddress 新たに表示する画面のアドレス
   */
  public changePage(nextPageAddress: PAGE_ADDRESS): void {
    // 同じページに遷移しようとした場合
    if (this.currentPage === nextPageAddress) {
      // 一度ダミーのアドレスに遷移してアニメーションを発火させてから同じページに遷移する
      this._changePageNotification.next(PAGE_ADDRESS.LOADING);
      window.setTimeout(() => {
        this.router.navigate([nextPageAddress]);
        this._changePageNotification.next(nextPageAddress);
      }, 0);
      return;
    }
    else {
      this.currentPage = nextPageAddress;
      this.router.navigate([nextPageAddress]);
      this._changePageNotification.next(nextPageAddress);
      return;
    }
  }
}

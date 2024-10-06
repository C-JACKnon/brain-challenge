import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PAGE_ADDRESS } from '../../app.routes';

/**
 * 画面コンポーネント切替サービス
 * @class
 */
@Injectable({
  providedIn: 'root'
})
export class ChangeComponentService {

  /**
   * @constructor
   * @param router Angularのルータクラス
   */
  constructor(
    private router: Router
  ) {}

  /**
   * 表示する画面の変更
   * @param nextPageAddress 新たに表示する画面のアドレス
   */
  public changePage(nextPageAddress: PAGE_ADDRESS): void {
    this.router.navigate([nextPageAddress]);
  }
}

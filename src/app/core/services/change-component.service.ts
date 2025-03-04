import { Injectable, inject } from '@angular/core';
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
  private readonly router = inject(Router); // Angularのルータクラス

  /**
   * 表示する画面の変更
   * @param nextPageAddress 新たに表示する画面のアドレス
   */
  public changePage(nextPageAddress: PAGE_ADDRESS): void {
    this.router.navigate([nextPageAddress]);
  }
}

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ChangeComponentService {

  constructor(
    private router: Router
  ) {}

  /**
   * 表示する画面の変更
   * @param nextPageAddress 新たに表示する画面のアドレス
   */
  public changePage(nextPageAddress: string): void {
    this.router.navigate([nextPageAddress]);
  }
}

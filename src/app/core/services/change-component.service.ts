import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { PageComponentsType } from '../types/page-components.enum';

@Injectable({
  providedIn: 'root'
})
export class ChangeComponentService {

  constructor(
    private router: Router
  ) {}

  /**
   * 表示する画面の変更
   * @param newPageComponent 新たに表示する画面コンポーネント
   */
  public changePage(newPageComponent: PageComponentsType): void {
    this.router.navigate([newPageComponent]);
  }
}

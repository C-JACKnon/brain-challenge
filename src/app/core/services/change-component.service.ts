import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { DisplayComponentType } from '../enum/display-component.enum';

@Injectable({
  providedIn: 'root'
})
export class ChangeComponentService {

  constructor(
    private router: Router
  ) {}

  /**
   * 表示する画面コンポーネントの変更
   * @param componentType 表示する画面コンポーネント種
   */
  public changeDisplayComponent(component: DisplayComponentType): void {
    this.router.navigate([component]);
  }
}

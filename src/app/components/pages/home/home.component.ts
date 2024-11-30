import { Component } from '@angular/core';
import { ChangeComponentService } from '../../../core/services/change-component.service';
import { PAGE_ADDRESS } from '../../../app.routes';
import { SquareButtonComponent } from '../../share/square-button/square-button.component';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { CommonModule } from '@angular/common';

/**
 * ホーム画面コンポーネント
 * @class
 */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    SquareButtonComponent,
    AngularSvgIconModule,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {
  public isFocusUserNameInputForm: boolean = false;

  /**
   * @constructor
   * @param changeComponentService 画面コンポーネント切替サービス
   */
  constructor(
    private changeComponentService: ChangeComponentService,
  ) { }

  /**
   * ユーザ名入力欄へのフォーカスイベント
   * @param isFocus フォーカスされたか否か
   */
  public onFocusUserNameInputForm(isFocus: boolean): void {
    this.isFocusUserNameInputForm = isFocus;

    if (!isFocus) {
      this.userNameValidation();
    }
  }

  /**
   * STARTボタンクリックイベント
   */
  public onClickStartButton(): void {
    this.changeComponentService.changePage(PAGE_ADDRESS.MAKE_TEN);
  }

  /**
   * RANKINGボタンクリックイベント
   */
  public onClickRankingButton(): void {
    this.changeComponentService.changePage(PAGE_ADDRESS.RANKING);
  }

  /**
   * HowToPlayボタンクリックイベント
   */
  public onClickHowToPlayButton(): void {
    this.changeComponentService.changePage(PAGE_ADDRESS.HOW_TO);
  }

  /**
   * ユーザ名バリデーションチェックを実行
   * - 先頭と最後の空白を削除する
   * - 最大文字数内に短くする
   */
  private userNameValidation(): void {
    const userNameInputFormElement = document.getElementById('user-name') as HTMLInputElement;
    let formatUserName = userNameInputFormElement.value;

    // 先頭の空文字を削除する
    let emptyIndex = 0;
    for (let i = 0; i < formatUserName.length; i++) {
      if (formatUserName[i] === ' ' || formatUserName[i] === '　') {
        emptyIndex++;
      }
      else {
        break;
      }
    }
    if (emptyIndex > 0) {
      formatUserName = formatUserName.slice(emptyIndex);
    }

    // 最後の空文字を削除する
    emptyIndex = 0;
    for (let i = formatUserName.length - 1; i >= 0; i--) {
      if (formatUserName[i] === ' ' || formatUserName[i] === '　') {
        emptyIndex++;
      }
      else {
        break;
      }
    }
    if (emptyIndex > 0) {
      formatUserName = formatUserName.slice(0, -emptyIndex);
    }

    // 最大文字数を超えている場合は最後の文字から超えている文字数分削除する
    const maxUserNameLength = 15;
    if (formatUserName.length > maxUserNameLength) {
      formatUserName = formatUserName.slice(0, maxUserNameLength);
    }

    userNameInputFormElement.value = formatUserName;
  }
}

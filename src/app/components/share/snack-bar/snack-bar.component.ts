import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_SNACK_BAR_DATA, MatSnackBar, MatSnackBarActions, MatSnackBarConfig, MatSnackBarLabel, MatSnackBarRef } from '@angular/material/snack-bar';

/**
 * スナックバーに設定するデータ
 * @class
 */
export class SnackBarData {
  public message: string = '';
  public buttonText: string = '';

  /**
   * @constructor
   * @param message メッセージ
   * @param buttonText ボタンのテキスト
   */
  constructor(message: string, buttonText: string = '') {
    this.message = message;
    this.buttonText = buttonText;
  }
} 

/**
 * スナックバーコンポーネント
 * @class
 */
@Component({
  selector: 'snack-bar',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatSnackBarLabel,
    MatSnackBarActions,
  ],
  templateUrl: './snack-bar.component.html',
  styleUrl: './snack-bar.component.scss'
})
export class SnackBarComponent {
  private readonly snackBarRef: MatSnackBarRef<MatSnackBar> = inject(MatSnackBarRef);
  public message: string = '';
  public buttonText: string = '';

  /**
   * @constructor
   * @param data スナックバーに設定されたオプション
   */
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: SnackBarData) {
    this.message = data.message;
    this.buttonText = data.buttonText;
  }

  /**
   * ボタン押下イベント
   */
  public onClickButton(): void {
    this.snackBarRef.dismissWithAction();
  }
}

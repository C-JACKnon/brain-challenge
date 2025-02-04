import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SQUARE_BUTTON_COLOR, SquareButtonComponent } from '../../../../share/square-button/square-button.component';

/**
 * ギブアップダイアログコンポーネント
 * @class
 */
@Component({
  selector: 'give-up-dialog',
  standalone: true,
  imports: [
    CommonModule,
    SquareButtonComponent,
    AngularSvgIconModule,
  ],
  templateUrl: './give-up-dialog.component.html',
  styleUrl: './give-up-dialog.component.scss'
})
export class GiveUpDialogComponent {
  public readonly SquareButtonColor = SQUARE_BUTTON_COLOR;
  readonly dialogRef = inject(MatDialogRef<GiveUpDialogComponent>);

  /**
   * 閉じるボタン押下イベント
   */
  public onClickCloseButton(): void {
    this.dialogRef.close(false); // ギブアップしない
  }

  /**
   * ギブアップボタン押下イベント
   */
  public onClickGiveUpButton(): void {
    this.dialogRef.close(true); // ギブアップする
  }
}

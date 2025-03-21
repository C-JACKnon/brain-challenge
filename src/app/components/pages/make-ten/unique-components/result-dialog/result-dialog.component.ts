import { CommonModule } from '@angular/common';
import { Component, Inject, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AngularSvgIconModule } from 'angular-svg-icon';
import { SQUARE_BUTTON_COLOR, SquareButtonComponent } from '../../../../share/square-button/square-button.component';
import { ScoreTimePipe } from "../../../../../core/pipe/score-time.pipe";

/**
 * リザルトダイアログコンポーネント
 * @class
 */
@Component({
  selector: 'result-dialog',
  standalone: true,
  imports: [
    CommonModule,
    SquareButtonComponent,
    AngularSvgIconModule,
    ScoreTimePipe
],
  templateUrl: './result-dialog.component.html',
  styleUrl: './result-dialog.component.scss'
})
export class ResultDialogComponent {
  public readonly SquareButtonColor = SQUARE_BUTTON_COLOR;
  readonly dialogRef = inject(MatDialogRef<ResultDialogComponent>);

  constructor(@Inject(MAT_DIALOG_DATA) public data: { score: number }) { }

  /**
   * リトライボタン押下イベント
   */
  public onClickRetryButton(): void {
    this.dialogRef.close(true);
  }

  /**
   * ホームボタン押下イベント
   */
  public onClickHomeButton(): void {
    this.dialogRef.close(false);
  }
}

import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * 四角ボタンコンポーネントの色
 */
export enum SQUARE_BUTTON_COLOR {
  BLUE,
  WHITE,
  RED,
}

/**
 * 四角ボタンコンポーネント
 * @class
 */
@Component({
  selector: 'square-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './square-button.component.html',
  styleUrl: './square-button.component.scss'
})
export class SquareButtonComponent {
  @Input() label: string = '';
  @Input() isLarge: boolean = false;
  @Input() color: SQUARE_BUTTON_COLOR = SQUARE_BUTTON_COLOR.BLUE;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  
  public readonly ColorType = SQUARE_BUTTON_COLOR;

  /**
   * ボタン押下イベント
   */
  public onClickButton(): void {
    this.onClick.emit();
  }
}

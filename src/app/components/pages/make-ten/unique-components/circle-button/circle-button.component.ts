import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * 丸ボタンコンポーネントの色
 */
export enum CIRCLE_BUTTON_COLOR {
  BLUE,
  GREEN,
  YELLOW,
  RED,
  PURPLE,
}

/**
 * 丸ボタンコンポーネント
 * @class
 */
@Component({
  selector: 'circle-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './circle-button.component.html',
  styleUrl: './circle-button.component.scss'
})
export class CircleButtonComponent {
  @Input() label: string = '';
  @Input() color: CIRCLE_BUTTON_COLOR = CIRCLE_BUTTON_COLOR.BLUE;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  
  public readonly ColorType = CIRCLE_BUTTON_COLOR;

  /**
   * ボタン押下イベント
   */
  public onClickButton(): void {
    this.onClick.emit();
  }
}

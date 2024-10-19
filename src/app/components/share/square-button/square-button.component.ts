import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * 四角ボタンコンポーネント
 * @class
 */
@Component({
  selector: 'square-button',
  standalone: true,
  imports: [],
  templateUrl: './square-button.component.html',
  styleUrl: './square-button.component.scss'
})
export class SquareButtonComponent {
  @Input() label: string = '';
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  
  /**
   * ボタン押下イベント
   */
  public onClickButton(): void {
    this.onClick.emit();
  }
}

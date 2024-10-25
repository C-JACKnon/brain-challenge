import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

/**
 * トグルボタンコンポーネント
 * @class
 */
@Component({
  selector: 'toggle-button',
  standalone: true,
  imports: [
    CommonModule,
  ],
  templateUrl: './toggle-button.component.html',
  styleUrl: './toggle-button.component.scss'
})
export class ToggleButtonComponent {
  @Input() isOn: boolean = true;
  @Output() onClick: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  /**
   * ボタン押下イベント
   */
  public onClickButton(): void {
    this.isOn = !this.isOn;
    this.onClick.emit(this.isOn);
  }
}

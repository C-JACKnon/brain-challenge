import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AngularSvgIconModule } from 'angular-svg-icon';

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
  imports: [
    CommonModule,
    AngularSvgIconModule,
  ],
  templateUrl: './square-button.component.html',
  styleUrl: './square-button.component.scss'
})
export class SquareButtonComponent implements OnInit {
  @Input() icon: string = '';
  @Input() label: string = '';
  @Input() isLarge: boolean = false;
  @Input() color: SQUARE_BUTTON_COLOR = SQUARE_BUTTON_COLOR.BLUE;
  @Output() onClick: EventEmitter<void> = new EventEmitter<void>();
  
  public readonly ColorType = SQUARE_BUTTON_COLOR;
  public iconClass: string = ''; // アイコンに設定するクラス

  public ngOnInit(): void {
    if (!this.icon) {
      return;
    }

    if (this.color === SQUARE_BUTTON_COLOR.BLUE) {
      this.iconClass = 'blue-icon';
    }
    else if (this.color === SQUARE_BUTTON_COLOR.WHITE) {
      this.iconClass = 'white-icon';
    }
    else if (this.color === SQUARE_BUTTON_COLOR.RED) {
      this.iconClass = 'red-icon';
    }
  }

  /**
   * ボタン押下イベント
   */
  public onClickButton(): void {
    this.onClick.emit();
  }
}

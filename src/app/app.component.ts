import { Component, OnInit } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { ChangeComponentService } from './core/services/change-component.service';
import { fadeInAnimation } from './app.animation';
import { PAGE_ADDRESS } from './app.routes';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
  ],
  animations: [fadeInAnimation],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  constructor(
    private changeComponentService: ChangeComponentService,
    private contexts: ChildrenOutletContexts,
  ) {}

  ngOnInit(): void {
    this.changeComponentService.changePage(PAGE_ADDRESS.HOME);
  }

  /**
   * ルーティングアニメーションのデータを取得する
   * @returns ルーティングするコンポーネント名
   */
  public getRouteAnimationData(): string {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['componentName'];
  }
}

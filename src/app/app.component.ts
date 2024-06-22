import { Component, OnInit } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { ChangeComponentService } from './core/services/change-component.service';
import { PageComponentsType } from './core/types/page-components.enum';
import { fadeInAnimation } from './app.animation';

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
    this.changeComponentService.changePage(PageComponentsType.Home);
  }

  /**
   * ルーティングアニメーションのデータを取得する
   */
  public getRouteAnimationData(): string {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['animation'];
  }
}

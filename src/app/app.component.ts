import { Component, OnInit } from '@angular/core';
import { ChildrenOutletContexts, RouterOutlet } from '@angular/router';
import { ChangeComponentService } from './core/services/change-component.service';
import { fadeInAnimation } from './app.animation';
import { PAGE_ADDRESS } from './app.routes';
import { DisplaySizeManagementService } from './core/services/display-size-management.service';
import { environment } from '../environments/environment';

/**
 * アプリケーション画面コンポーネント
 * @class
 */
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
  /**
   * @constructor
   * @param contexts Angularのルーティング要素参照用クラス
   * @param changeComponentService 画面サイズ切替サービス
   * @param displaySizeManagementService 画面サイズ管理サービス
   */
  constructor(
    private contexts: ChildrenOutletContexts,
    private changeComponentService: ChangeComponentService,
    public displaySizeManagementService: DisplaySizeManagementService,
  ) {}

  /**
   * 初期処理
   */
  public ngOnInit(): void {
    // 環境変数の確認
    console.info(environment.env);

    // アプリケーション起動時最初にホーム画面コンポーネントに遷移する
    this.changeComponentService.changePage(PAGE_ADDRESS.HOME);

    // アプリケーションサイズを更新する
    this.displaySizeManagementService.updateApplicationSize();

    window.addEventListener('resize', () => {
      this.displaySizeManagementService.updateApplicationSize();
    });
  }

  /**
   * ルーティングアニメーションのデータを取得する
   * @returns ルーティングするコンポーネント名
   */
  public getRouteAnimationData(): string {
    return this.contexts.getContext('primary')?.route?.snapshot?.data?.['componentName'];
  }
}

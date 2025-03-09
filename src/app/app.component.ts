import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ChangeComponentService } from './core/services/change-component.service';
import { fadeInAnimation } from './app.animation';
import { PAGE_ADDRESS } from './app.routes';
import { DisplaySizeManagementService } from './core/services/display-size-management.service';
import { environment } from '../environments/environment';
import { Subject, takeUntil } from 'rxjs';

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
export class AppComponent implements OnInit, OnDestroy {
  private readonly changeComponentService = inject(ChangeComponentService); // 画面サイズ切替サービス
  public readonly displaySizeManagementService = inject(DisplaySizeManagementService); // 画面サイズ管理サービス

  public currentPageAddress: PAGE_ADDRESS = PAGE_ADDRESS.HOME;

  private destroy$: Subject<void> = new Subject(); // Subscribe一括破棄用変数

  /**
   * ライフサイクル: 初期処理
   */
  public ngOnInit(): void {
    // 環境変数の確認
    console.info(environment.env);

    // アプリケーション起動時最初にホーム画面コンポーネントに遷移する
    this.changeComponentService.changePage(PAGE_ADDRESS.HOME);

    // 画面遷移の通知
    this.changeComponentService.changePageNotification
    .pipe(takeUntil(this.destroy$))
    .subscribe((nextPageAddress: PAGE_ADDRESS) => {
      this.currentPageAddress = nextPageAddress;
    });

    // アプリケーションサイズを更新する
    this.displaySizeManagementService.updateApplicationSize();

    window.addEventListener('resize', () => {
      this.displaySizeManagementService.updateApplicationSize();
    });
  }

  /**
   * ライフサイクル: コンポーネント破棄時
   */
  public ngOnDestroy(): void {
    // Subscribeの一括破棄
    this.destroy$.next();
    this.destroy$.complete();
  }
}

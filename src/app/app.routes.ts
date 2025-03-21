import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { HowToComponent } from './components/pages/how-to/how-to.component';
import { MakeTenComponent } from './components/pages/make-ten/make-ten.component';
import { ScoreComponent } from './components/pages/score/score.component';

/**
 * ページのアドレス
 */
export enum PAGE_ADDRESS {
  HOME = 'home',
  SCORE = 'score',
  HOW_TO = 'how-to',
  MAKE_TEN = 'make-ten',
  LOADING = 'loading', // 同じ画面に遷移するためのアドレス
};

/**
 * ルーティング定義
 */
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: PAGE_ADDRESS.HOME, component: HomeComponent },
  { path: PAGE_ADDRESS.HOW_TO, component: HowToComponent },
  { path: PAGE_ADDRESS.MAKE_TEN, component: MakeTenComponent },
  { path: PAGE_ADDRESS.SCORE, component: ScoreComponent },
  { path: '**', redirectTo: '' },
];

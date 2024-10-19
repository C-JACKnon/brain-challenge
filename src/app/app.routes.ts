import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { HowToComponent } from './components/pages/how-to/how-to.component';
import { MakeTenComponent } from './components/pages/make-ten/make-ten.component';
import { RankingComponent } from './components/pages/ranking/ranking.component';
import { SettingsComponent } from './components/pages/settings/settings.component';

/**
 * ページのアドレス
 */
export enum PAGE_ADDRESS {
  HOME = 'home',
  RANKING = 'ranking',
  HOW_TO = 'how-to',
  MAKE_TEN = 'make-ten',
  SETTINGS = 'settings',
};

/**
 * ルーティング定義
 */
export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: PAGE_ADDRESS.HOME, component: HomeComponent, data: { componentName: PAGE_ADDRESS.HOME } },
  { path: PAGE_ADDRESS.HOW_TO, component: HowToComponent, data: { componentName: PAGE_ADDRESS.HOW_TO } },
  { path: PAGE_ADDRESS.MAKE_TEN, component: MakeTenComponent, data: { componentName: PAGE_ADDRESS.MAKE_TEN } },
  { path: PAGE_ADDRESS.RANKING, component: RankingComponent, data: { componentName: PAGE_ADDRESS.RANKING } },
  { path: PAGE_ADDRESS.SETTINGS, component: SettingsComponent, data: { componentName: PAGE_ADDRESS.SETTINGS } },
  { path: '**', redirectTo: '' },
];

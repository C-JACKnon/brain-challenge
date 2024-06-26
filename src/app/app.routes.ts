import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { HowToComponent } from './components/pages/how-to/how-to.component';
import { MakeTenComponent } from './components/pages/make-ten/make-ten.component';
import { RankingComponent } from './components/pages/ranking/ranking.component';

export const PAGE_ADDRESS = {
  HOME: 'home',
  RANKING: 'ranking',
  HOW_TO: 'how-to',
  MAKE_TEN: 'make-ten',
} as const;

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: PAGE_ADDRESS.HOME, component: HomeComponent, data: { animation: 'home' } },
  { path: PAGE_ADDRESS.HOW_TO, component: HowToComponent, data: { animation: 'how-to' } },
  { path: PAGE_ADDRESS.MAKE_TEN, component: MakeTenComponent, data: { animation: 'make-ten' } },
  { path: PAGE_ADDRESS.RANKING, component: RankingComponent, data: { animation: 'ranking' } },
  { path: '**', redirectTo: '' },
];

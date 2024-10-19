import { Routes } from '@angular/router';
import { HomeComponent } from './components/pages/home/home.component';
import { HowToComponent } from './components/pages/how-to/how-to.component';
import { MakeTenComponent } from './components/pages/make-ten/make-ten.component';
import { RankingComponent } from './components/pages/ranking/ranking.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'home', component: HomeComponent, data: { animation: 'home' } },
  { path: 'how-to', component: HowToComponent, data: { animation: 'how-to' } },
  { path: 'make-ten', component: MakeTenComponent, data: { animation: 'make-ten' } },
  { path: 'ranking', component: RankingComponent, data: { animation: 'ranking' } },
  { path: '**', redirectTo: '' },
];

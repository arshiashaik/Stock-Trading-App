import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { SearchresultComponent } from './searchresult/searchresult.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'search/home',
    pathMatch: 'full',
  },
  {
    path: 'search/undefined',
    redirectTo: 'search/home',
    pathMatch: 'full',
  },
  { path: 'search/home', component: SearchBarComponent },
  {
    path: 'search/:ticker',
    component: SearchresultComponent,
    data: {
      reuseComponent: true,
    },
  },
  {
    path: 'watchlist',
    component: WatchlistComponent,
  },
  {
    path: 'portfolio',
    component: PortfolioComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}

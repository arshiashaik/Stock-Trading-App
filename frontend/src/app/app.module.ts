import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HighchartsChartModule } from 'highcharts-angular';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NavigationBarComponent } from './navigation-bar/navigation-bar.component';
import { FooterComponent } from './footer/footer.component';
import { SearchBarComponent } from './search-bar/search-bar.component';
import { WatchlistComponent } from './watchlist/watchlist.component';
import { PortfolioComponent } from './portfolio/portfolio.component';
import { SearchresultComponent } from './searchresult/searchresult.component';
import { ChartTabComponent } from './chart-tab/chart-tab.component';
import { TrendChartComponent } from './trend-chart/trend-chart.component';
import { EarnChartComponent } from './earn-chart/earn-chart.component';
import { NewsModalComponent } from './news-modal/news-modal.component';
import { SummaryChartComponent } from './summary-chart/summary-chart.component';
import { RouteReuseStrategy } from '@angular/router';
import { CustomRouteReuseStrategy } from './custom-route-reuse-strategy';
import { BuyModalComponent } from './buy-modal/buy-modal.component';
@NgModule({
  declarations: [
    AppComponent,
    NavigationBarComponent,
    FooterComponent,
    SearchBarComponent,
    WatchlistComponent,
    PortfolioComponent,
    SearchresultComponent,
    ChartTabComponent,
    TrendChartComponent,
    EarnChartComponent,
    NewsModalComponent,
    SummaryChartComponent,
    BuyModalComponent,
  ],
  imports: [
    HighchartsChartModule,
    HttpClientModule,
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    MatButtonModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatInputModule,
    NgbModule,
    MatTabsModule,
    MatProgressSpinnerModule,
  ],
  providers: [
    {
      provide: RouteReuseStrategy,
      useClass: CustomRouteReuseStrategy,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

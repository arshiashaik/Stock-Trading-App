import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
export interface companyData {
  country: string;
  currency: string;
  exchange: string;
  finnhubIndustry: string;
  ipo: string;
  logo: string;
  marketCapitalization: number;
  name: string;
  phone: string;
  shareOutstanding: number;
  ticker: string;
  weburl: string;
}

@Injectable({
  providedIn: 'root',
})
export class ServerServicesService {
  serverURL = 'https://angularhellolin.azurewebsites.net';
  AutocompleteURL = `${this.serverURL}/autocomplete?searchQuery=`;
  CompanydescriptionURL = `${this.serverURL}/companydescription?searchQuery=`;
  LatestnewsURL = `${this.serverURL}/news?searchQuery=`;
  HistoryURL = `${this.serverURL}/history?searchQuery=`;
  SocialURL = `${this.serverURL}/social?searchQuery=`;
  TrendsURL = `${this.serverURL}/trends?searchQuery=`;
  EarningsURL = `${this.serverURL}/earnings?searchQuery=`;
  LatestURL = `${this.serverURL}/latestpricestock?searchQuery=`;
  PeersURL = `${this.serverURL}/peers?searchQuery=`;
  SummaryURL = `${this.serverURL}/summary?searchQuery=`;
  watchlistURL = `${this.serverURL}/watchlist?searchQuery=`;

  constructor(public http: HttpClient) {}

  getAutocompleteData(query: string): Observable<string[]> {
    var resp = this.http.get<any[]>(this.AutocompleteURL + query);
    return resp;
  }

  getLatestStockData(query: string): Observable<string[]> {
    var Latestresp = this.http.get<any[]>(this.LatestURL + query);
    return Latestresp;
  }

  getCompanyDescription(query: string): Observable<string[]> {
    var compresp = this.http.get<any[]>(this.CompanydescriptionURL + query);
    return compresp;
  }
  getLatestNews(query: string): Observable<string[]> {
    var newsresp = this.http.get<any[]>(this.LatestnewsURL + query);
    return newsresp;
  }

  getHistory(query: string): Observable<string[]> {
    var histresp = this.http.get<any[]>(this.HistoryURL + query);
    return histresp;
  }

  getSocial(query: string): Observable<string[]> {
    var socialresp = this.http.get<any[]>(this.SocialURL + query);
    return socialresp;
  }

  getTrends(query: string): Observable<string[]> {
    var trendsresp = this.http.get<any[]>(this.TrendsURL + query);
    return trendsresp;
  }

  getEarnings(query: string): Observable<string[]> {
    var earnresp = this.http.get<any[]>(this.EarningsURL + query);
    return earnresp;
  }

  getPeersData(query: string): Observable<string[]> {
    var peersresp = this.http.get<any[]>(this.PeersURL + query);
    return peersresp;
  }

  getSummary(query: string): Observable<string[]> {
    var summresp = this.http.get<any[]>(this.SummaryURL + query);
    return summresp;
  }

  getWatchlist(query: string): Observable<string[]> {
    var watchresp = this.http.get<any[]>(this.watchlistURL + query);
    return watchresp;
  }
}

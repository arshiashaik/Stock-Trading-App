import { Component, OnInit, AfterContentInit, DoCheck } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServerServicesService } from '../server-services.service';
import { delay, map } from 'rxjs/operators';
import { NewsModalComponent } from '../news-modal/news-modal.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Subscription, timer } from 'rxjs';
import { NgbAlert } from '@ng-bootstrap/ng-bootstrap';
import { InteractionService } from '../interaction.service';
@Component({
  selector: 'app-searchresult',
  templateUrl: './searchresult.component.html',
  styleUrls: ['./searchresult.component.css'],
})
export class SearchresultComponent implements OnInit {
  timerSub: Subscription;
  closeResult = '';
  public message: string = 'Uninitialized';
  public response;
  ticker: string = '';
  tickerSymbol: string;
  tickerName: string;
  tickerExchange: string;
  tickerImage: string;
  ipo: string;
  webpage: string;
  industry: string;
  isAlert: boolean;
  isSold: boolean;
  isBought: boolean;
  isShow: boolean;
  history;
  data;
  summdata;
  news;
  Data;
  social;
  posR;
  negR;
  totR;
  posT;
  negT;
  totT;
  summ;
  closed;
  parentdata;
  isSumm;
  pardata;
  trends;
  isHighcharts;
  isTrends;
  isLatest;
  isMarket: boolean = false;
  inWatchlist: boolean;
  isInWatchlist: boolean;
  Time;
  latest;
  elapsed;
  color;
  earn;
  peers;
  high;
  low;
  open;
  prevC;
  todaysDateTime;
  quantity;
  buyModal;
  wallet = localStorage.getItem('wallet') || 25000.0;
  iscantbuy;
  isAddWatch: boolean;
  isRemoWatch: boolean;
  isAlertSell: boolean;
  PaperMoney1: number;
  MaxWallet = 25000.0;
  wishList = JSON.parse(localStorage.getItem('wishList')) || [];
  portfolio = JSON.parse(localStorage.getItem('Portfolio')) || {};
  //localStorage.setItem('Wallet', '25000.00')
  PaperMoney;
  greenArrow = './assets/caret-up-fill.svg';
  redArrow = './assets/caret-down-fill.svg';
  starEmpty = './assets/star-empty.svg';
  startFull = './assets/star-full.svg';
  isForSellCalc;
  validTick;

  constructor(
    private activatedroute: ActivatedRoute,
    public server: ServerServicesService,
    private _interactionService: InteractionService,
    private router: Router,
    private newsModalService: NgbModal
  ) {}

  async fetchData() {
    this.message = 'Fetching..';
    this.response = '';
    this.response = await this.server
      .getHistory(this.ticker)
      .pipe(delay(2000))
      .toPromise();
    this.message = 'Fetched';
  }
  openNewsDetail(news) {
    const newsModalRef = this.newsModalService.open(NewsModalComponent);
    newsModalRef.componentInstance.news = news;
  }
  getSearchResult() {
    this.server.getCompanyDescription(this.ticker).subscribe((companyData) => {
      this.Data = companyData;
      this.tickerSymbol = this.Data.ticker;
      this.tickerName = this.Data.name;
      this.tickerExchange = this.Data.exchange;
      this.tickerImage = this.Data.logo;
      this.ipo = this.Data.ipo;
      this.industry = this.Data.finnhubIndustry;
      this.webpage = this.Data.weburl;
      // if (this.ticker == this.tickerSymbol) {
      //   console.log(this.tickerSymbol);
      //   this.validTick = true;
      // } else {
      //   this.validTick = false;
      // }
    });
  }
  getNewsResult() {
    this.server.getLatestNews(this.ticker).subscribe((newsData) => {
      this.news = newsData;
    });
  }

  getSocialResult() {
    this.server.getSocial(this.ticker).subscribe((socialData) => {
      this.social = socialData;
      this.posR = this.social.positivereddit;
      this.negR = this.social.negativereddit;
      this.totR = this.social.totalreddit;
      this.posT = this.social.positivetwitter;
      this.negT = this.social.negativetwitter;
      this.totT = this.social.totaltwitter;
    });
  }

  private async fetchChartData(value) {
    this.isHighcharts = 'Fetching..';
    this.history = await this.server
      .getHistory(value)
      .pipe(delay(2000))
      .toPromise();
    this.isHighcharts = 'Fetched';
  }
  private async fetchTrendData(value) {
    this.isTrends = 'Fetching..';
    this.trends = await this.server
      .getTrends(value)
      .pipe(delay(2000))
      .toPromise();
    this.isTrends = 'Fetched';
  }

  private async fetchLatestData(value) {
    this.isLatest = 'Fetching..';
    this.latest = await this.server
      .getLatestStockData(value)
      .pipe()
      .toPromise();
    this.isLatest = 'Fetched';
    this.Time = new Date();
    this.elapsed = new Date(this.latest.t * 1000);
    const diffInMilliseconds = Math.abs(this.Time - this.elapsed);
    if (diffInMilliseconds < 300000) {
      this.isMarket = true;
      this.timerSub = timer(0, 15000)
        .pipe(
          map(() => {
            var query = this.ticker + ',' + this.latest.t;
            this.fetchSummaryData(query);
            console.log(query);
            this.todaysDateTime = this.getDate() + ' ' + this.getTime();
          })
        )
        .subscribe();

      this.color = 'green';
    } else {
      this.isMarket = false;
      this.todaysDateTime = this.getDate() + ' ' + this.getTime();
      this.closed = this.getunixToDatetime(this.latest.t);
      var query = this.ticker + ',' + this.latest.t;
      this.fetchSummaryData(query);
      this.color = 'red';
      // this.high = this.latest.h;
      // this.low = this.latest.l;
      // this.open = this.latest.o;
      // this.prevC = this.latest.pc;
    }
    this.high = this.latest.h;
    this.low = this.latest.l;
    this.open = this.latest.o;
    this.prevC = this.latest.pc;
  }

  private async fetchEarnData(value) {
    //this.isTrends = 'Fetching..';
    this.earn = await this.server.getEarnings(value).pipe().toPromise();

    //this.isTrends = 'Fetched';
  }

  private async fetchPeerData(value) {
    //this.isTrends = 'Fetching..';
    this.peers = await this.server
      .getPeersData(value)
      .pipe(delay(2000))
      .toPromise();
    //this.isTrends = 'Fetched';
  }
  private async fetchSummaryData(value) {
    this.isSumm = 'Fetching..';
    this.summ = await this.server.getSummary(value).pipe().toPromise();
    this.isSumm = 'Fetched';
  }

  onPeersClicked(value) {
    this.router.navigateByUrl(`search/${value}`);
    this._interactionService.sendMessage(value);
  }

  ngOnInit(): void {
    this.activatedroute.paramMap.subscribe((params) => {
      this.ticker = params.get('ticker').toUpperCase();
      this.getSearchResult();
      this.getNewsResult();
      this.getSocialResult();
      this.fetchData();
      this.fetchChartData(this.ticker);
      this.fetchTrendData(this.ticker);
      this.fetchEarnData(this.ticker);
      this.fetchPeerData(this.ticker);
      this.fetchLatestData(this.ticker);
      this.checkWatchList(this.ticker);
      if (this.portfolio.hasOwnProperty(this.ticker)) {
        this.isShow = true;
        console.log(this.isShow);
      } else {
        this.isShow = false;
      }
    });
  }

  getDate() {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    var to = yyyy + '-' + mm + '-' + dd;
    return to;
  }

  getTime() {
    var date = new Date();
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');
    var seconds = date.getSeconds().toString().padStart(2, '0');
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
  }

  getUnUnix(unixtimestamp) {
    var date = new Date(unixtimestamp * 1000);
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');
    var seconds = date.getSeconds().toString().padStart(2, '0');
    var time = hours + ':' + minutes + ':' + seconds;
    return time;
  }

  getunixToDatetime(value) {
    var unixtimestamp = value;
    var date = new Date(unixtimestamp * 1000);
    var year = date.getFullYear().toString().padStart(2, '0');
    var month = date.getMonth().toString().padStart(2, '0');
    var day = date.getDate().toString().padStart(2, '0');
    var hours = date.getHours().toString().padStart(2, '0');
    var minutes = date.getMinutes().toString().padStart(2, '0');
    var seconds = date.getSeconds().toString().padStart(2, '0');
    var convdataTime =
      year +
      '-' +
      month +
      '-' +
      day +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds;
    return convdataTime;
  }
  checkWatchList(value) {
    for (var i = 0; i < this.wishList.length; i++) {
      if (this.wishList[i] == value) {
        this.inWatchlist = true;
        var isPresent = true;
        this.inWatchlist = true;
      }
    }
    if (!isPresent) {
      this.inWatchlist = false;
    }
  }
  toggleWishList(value) {
    console.log('hello');
    var tickerCheck = value;
    for (var j = 0; j < this.wishList.length; j++) {
      if (this.wishList[j] == tickerCheck) {
        var isPresent = true;
        this.wishList.pop(tickerCheck);
        this.inWatchlist = false;
        this.isInWatchlist = false;
        this.isRemoWatch = true;
        setTimeout(() => {
          this.isRemoWatch = false;
        }, 2000);
        localStorage.setItem('wishList', JSON.stringify(this.wishList));
        break;
      }
    }
    if (!isPresent) {
      this.wishList.push(value);
      this.inWatchlist = true;
      this.isInWatchlist = true;
      this.isAddWatch = true;
      setTimeout(() => {
        this.isAddWatch = false;
      }, 2000);
      localStorage.setItem('wishList', JSON.stringify(this.wishList));
    }
  }
  Buy(content) {
    this.quantity = 0;
    this.wallet = localStorage.getItem('Wallet');
    if (!this.wallet) {
      this.wallet = 25000.0;
    }
    this.buyModal = this.newsModalService.open(content);
  }
  buyStockFunc() {
    this.isAlert = true;
    setTimeout(() => {
      this.isAlert = false;
    }, 3000);
    this.isBought = true;
    this.isShow = true;
    var stockPurchased: Object = {
      Ticker: this.ticker,
      TotalCost: parseFloat((this.quantity * this.latest.c).toFixed(2)),
      Quantity: this.quantity,
      AvgCost: this.latest.c,
      CN: this.tickerName,
      Current: this.latest.c.toFixed(2),
    };
    if (!this.portfolio.length) {
      var stockPurchasedTemp: Object = {};
      stockPurchasedTemp[this.ticker] = stockPurchased;
      this.portfolio = stockPurchasedTemp;
      localStorage.setItem('Portfolio', JSON.stringify(this.portfolio));
    } else {
      this.portfolio = JSON.parse(localStorage.getItem('Portfolio'));
      if (this.portfolio.hasOwnProperty(this.ticker)) {
        var previousStockData = this.portfolio[this.ticker];
        previousStockData['Quantity'] = parseFloat(
          (previousStockData['Quantity'] + stockPurchased['Quantity']).toFixed(
            2
          )
        );
        previousStockData['TotalCost'] = parseFloat(
          (
            previousStockData['TotalCost'] + stockPurchased['TotalCost']
          ).toFixed(2)
        );
        previousStockData['AvgCost'] = parseFloat(
          (
            previousStockData['TotalCost'] / previousStockData['Quantity']
          ).toFixed(2)
        );
        this.portfolio[this.ticker] = previousStockData;
      } else {
        this.portfolio[this.ticker] = stockPurchased;
      }
      localStorage.setItem('Portfolio', JSON.stringify(this.portfolio));
    }
    this.PaperMoney = this.MaxWallet - this.portfolio[this.ticker].TotalCost;
    localStorage.setItem('Wallet', JSON.stringify(this.PaperMoney));
    this.quantity = 0;
    this.buyModal.close();
  }

  Sell(content) {
    this.quantity = 0;
    this.wallet = localStorage.getItem('Wallet');
    this.buyModal = this.newsModalService.open(content);
  }
  sellStock() {
    this.isAlertSell = true;
    setTimeout(() => {
      this.isAlertSell = false;
    }, 3000);
    this.isSold = true;
    this.isShow = true;
    var totalcost = this.quantity * this.latest.c;
    var stockPurchased: Object = {
      Ticker: this.ticker,
      TotalCost: parseFloat((this.quantity * this.latest.c).toFixed(2)),
      Quantity: this.quantity,
      AvgCost: this.latest.c,
      CN: this.tickerName,
      Current: this.latest.c.toFixed(2),
    };
    if (!this.portfolio) {
      var stockPurchasedTemp: Object = {};
      stockPurchasedTemp[this.ticker] = stockPurchased;
      this.portfolio = stockPurchasedTemp;
      localStorage.setItem('Portfolio', JSON.stringify(this.portfolio));
    } else {
      this.portfolio = JSON.parse(localStorage.getItem('Portfolio'));
      if (this.portfolio.hasOwnProperty(this.ticker)) {
        var previousStockData = this.portfolio[this.ticker];
        previousStockData['Quantity'] = parseFloat(
          (previousStockData['Quantity'] - stockPurchased['Quantity']).toFixed(
            2
          )
        );
        previousStockData['TotalCost'] = parseFloat(
          (
            previousStockData['TotalCost'] - stockPurchased['TotalCost']
          ).toFixed(2)
        );
        previousStockData['AvgCost'] = parseFloat(
          (
            previousStockData['TotalCost'] / previousStockData['Quantity']
          ).toFixed(2)
        );
        this.portfolio[this.ticker] = previousStockData;
      } else {
        this.portfolio[this.ticker] = stockPurchased;
      }
      if (this.portfolio[this.ticker].Quantity == 0) {
        this.isShow = false;
        delete this.portfolio[this.ticker];
      }
      localStorage.setItem('Portfolio', JSON.stringify(this.portfolio));
    }
    this.PaperMoney1 = parseFloat(localStorage.getItem('Wallet')) + totalcost;
    localStorage.setItem('Wallet', JSON.stringify(this.PaperMoney1));
    this.quantity = 0;
    this.buyModal.close();
  }

  ngOnDestroy() {
    if (this.timerSub) {
      this.timerSub.unsubscribe();
    }
  }
}

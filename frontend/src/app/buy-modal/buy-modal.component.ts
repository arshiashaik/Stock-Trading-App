import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-buy-modal',
  templateUrl: './buy-modal.component.html',
  styleUrls: ['./buy-modal.component.css'],
})
export class BuyModalComponent implements OnInit {
  @Input() Ticker;
  @Input() TotalCost;
  @Input() Quantity;
  @Input() AvgCost;
  @Input() CN;
  @Input() Current;
  @Output() parentFunction: EventEmitter<any> = new EventEmitter();
  quantity;
  buyModal;
  isSold;
  wallet = localStorage.getItem('wallet') || 25000.0;
  iscantbuy;
  isAlert;
  isBought;
  isShow;

  isAddWatch: boolean;
  isRemoWatch: boolean;
  isAlertSell: boolean;
  PaperMoney1: number;
  MaxWallet = 25000.0;
  wishList = JSON.parse(localStorage.getItem('wishList')) || [];
  portfolio = JSON.parse(localStorage.getItem('Portfolio')) || {};
  PaperMoney;

  constructor(private newsModalService: NgbModal) {}

  ngOnInit(): void {
    console.log(+' ' + this.Quantity);
  }
  Buy(contents) {
    this.quantity = 0;
    this.wallet = localStorage.getItem('Wallet');
    if (!this.wallet) {
      this.wallet = 25000.0;
    }
    this.buyModal = this.newsModalService.open(contents);
  }
  buyStockFunc() {
    this.isAlert = true;
    setTimeout(() => {
      this.isAlert = false;
    }, 3000);
    this.isBought = true;
    this.isShow = true;
    var stockPurchased: Object = {
      Ticker: this.Ticker,
      TotalCost: parseFloat((this.quantity * this.Current).toFixed(2)),
      Quantity: this.quantity,
      AvgCost: this.Current,
      CN: this.CN,
      Current: this.Current,
    };
    if (!this.portfolio) {
      var stockPurchasedTemp: Object = {};
      stockPurchasedTemp[this.Ticker] = stockPurchased;
      this.portfolio = stockPurchasedTemp;
      localStorage.setItem('Portfolio', JSON.stringify(this.portfolio));
    } else {
      this.portfolio = JSON.parse(localStorage.getItem('Portfolio'));
      if (this.portfolio.hasOwnProperty(this.Ticker)) {
        var previousStockData = this.portfolio[this.Ticker];
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
        this.portfolio[this.Ticker] = previousStockData;
      } else {
        this.portfolio[this.Ticker] = stockPurchased;
      }
      localStorage.setItem('Portfolio', JSON.stringify(this.portfolio));
    }
    this.PaperMoney = this.MaxWallet - this.portfolio[this.Ticker].TotalCost;
    localStorage.setItem('Wallet', JSON.stringify(this.PaperMoney));
    this.quantity = 0;
    this.parentFunction.emit(['isAlert', this.Ticker]);
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
    var totalcost = this.quantity * this.Current;
    var stockPurchased: Object = {
      Ticker: this.Ticker,
      TotalCost: parseFloat((this.quantity * this.Current).toFixed(2)),
      Quantity: this.quantity,
      AvgCost: this.Current,
      CN: this.CN,
      Current: this.Current,
    };
    if (!this.portfolio) {
      var stockPurchasedTemp: Object = {};
      stockPurchasedTemp[this.Ticker] = stockPurchased;
      this.portfolio = stockPurchasedTemp;
      localStorage.setItem('Portfolio', JSON.stringify(this.portfolio));
    } else {
      this.portfolio = JSON.parse(localStorage.getItem('Portfolio'));
      if (this.portfolio.hasOwnProperty(this.Ticker)) {
        var previousStockData = this.portfolio[this.Ticker];
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
        this.portfolio[this.Ticker] = previousStockData;
      } else {
        this.portfolio[this.Ticker] = stockPurchased;
      }
      if (this.portfolio[this.Ticker].Quantity == 0) {
        this.isShow = false;
        delete this.portfolio[this.Ticker];
      }
      localStorage.setItem('Portfolio', JSON.stringify(this.portfolio));
    }
    this.PaperMoney1 = parseFloat(localStorage.getItem('Wallet')) + totalcost;
    localStorage.setItem('Wallet', JSON.stringify(this.PaperMoney1));
    this.quantity = 0;
    this.buyModal.close();
    this.parentFunction.emit(['isAlertSell', this.Ticker]);
  }
}

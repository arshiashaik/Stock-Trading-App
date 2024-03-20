import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ServerServicesService } from '../server-services.service';
import { InteractionService } from '../interaction.service';
@Component({
  selector: 'app-watchlist',
  templateUrl: './watchlist.component.html',
  styleUrls: ['./watchlist.component.css'],
})
export class WatchlistComponent implements OnInit {
  isNotFound: boolean = true;
  data;
  summary = [];
  wishList = JSON.parse(localStorage.getItem('wishList')) || [];
  redArrow = './assets/caret-down-fill.svg';
  greenArrow = './assets/caret-up-fill.svg';

  constructor(
    private server: ServerServicesService,
    private router: Router,
    private _interactionService: InteractionService
  ) {}

  private async fetchWatchData() {
    for (var i = 0; i < this.wishList.length; i++) {
      this.data = await this.server
        .getWatchlist(this.wishList[i])
        .pipe()
        .toPromise();
      this.summary.push(this.data);
    }
  }
  nav(value) {
    this.router.navigateByUrl(`search/${value}`);
    this._interactionService.sendMessage(value);
  }

  remove(value) {
    this.wishList.pop(value);
    localStorage.setItem('wishList', JSON.stringify(this.wishList));
    this.redirectTo('/watchlist');
    if (this.wishList.length) {
      this.isNotFound = false;
    } else {
      this.isNotFound = true;
    }
  }
  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }

  ngOnInit(): void {
    if (this.wishList.length) {
      this.isNotFound = false;
      this.fetchWatchData();
    } else {
      this.isNotFound = true;
    }
  }
}

import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { ServerServicesService } from '../server-services.service';
import { Router } from '@angular/router';
import { InteractionService } from '../interaction.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { chainedInstruction } from '@angular/compiler/src/render3/view/util';
@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.css'],
})
export class PortfolioComponent implements OnInit {
  parentFunction(data) {
    if (data[0] == 'isAlertSell') {
      //this.cha(data[0]);
      this.isAlertSell = true;
      setTimeout(() => {
        this.isAlertSell = false;
        this.redirectTo('portfolio');
      }, 2000);
      this.tick = data[1];
      console.log(this.tick);
    } else {
      //this.cha(data[0]);
      this.isAlert = true;
      setTimeout(() => {
        this.isAlert = false;
        this.redirectTo('portfolio');
      }, 2000);
      this.tick = data[1];
      console.log(this.tick);
    }
  }
  redirectTo(uri: string) {
    this.router
      .navigateByUrl('/', { skipLocationChange: true })
      .then(() => this.router.navigate([uri]));
  }
  // cha(data) {
  //   if (data[0] == 'isAlertSell') {
  //     this.isAlertSell = true;
  //   } else {
  //     this.isAlert = true;
  //   }
  // }
  isNotFound: boolean;
  data;
  store = [];
  company = [];
  arrayofarrays = [];
  sendtobut;
  tick;
  isAlert: boolean;
  isAlertSell: boolean;
  isSold;
  wallet = localStorage.getItem('Wallet') || 25000.0;
  portfolio = JSON.parse(localStorage.getItem('Portfolio')) || {};
  redArrow = './assets/caret-down-fill.svg';
  greenArrow = './assets/caret-up-fill.svg';
  constructor(
    private server: ServerServicesService,
    private _interactionService: InteractionService,
    private router: Router,
    private newsModalService: NgbModal
  ) {}

  ngOnInit(): void {
    if (Object.keys(this.portfolio).length) {
      this.isNotFound = false;
      Object.entries(this.portfolio).forEach((item) => {
        this.store.push(item[0]);
      });
      for (const item of this.store) {
        this.server.getCompanyDescription(item).subscribe((data) => {
          this.data = data;
          this.company.push({ name: this.data.name });
        });
        this.arrayofarrays.push(this.portfolio[item]);
        this.sendtobut = this.arrayofarrays;
      }
    } else {
      this.isNotFound = true;
    }
  }
  nav(value) {
    this.router.navigateByUrl(`search/${value}`);
    this._interactionService.sendMessage(value);
  }

  red(value) {
    if (value < 0) {
      return 'red';
    } else {
      return 'black';
    }
  }
}

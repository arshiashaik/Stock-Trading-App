import { Component, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { switchMap, debounceTime, tap, finalize } from 'rxjs/operators';
import { ServerServicesService } from '../server-services.service';
import { InteractionService } from '../interaction.service';
import { Router } from '@angular/router';
import { of, Subscription } from 'rxjs';
export interface Lookup {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string;
}
@Component({
  selector: 'app-search-bar',
  templateUrl: './search-bar.component.html',
  styleUrls: ['./search-bar.component.css'],
})
export class SearchBarComponent implements OnInit, OnDestroy {
  @Input() value;
  searchInput: FormGroup;
  ticker: string;
  control: FormControl;
  isLoading: boolean = false;
  isValid: boolean = false;
  options: Lookup[] = [];
  sub: Subscription;
  isDivOpen: boolean = false;
  tickercheck: string;
  isValidTicker: boolean = false;
  tickersymbolFind;
  autoticker;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private services: ServerServicesService,
    private _interactionService: InteractionService
  ) {}

  ngOnInit(): void {
    this.searchInput = new FormGroup({
      tickerSymbol: new FormControl('', Validators.required),
    });

    this.sub = this.searchInput
      .get('tickerSymbol')
      .valueChanges.pipe(
        debounceTime(300),
        tap(() => {
          this.isLoading = true;
          this.options = [];
        }),
        switchMap((value) =>
          value !== ''
            ? this.services.getAutocompleteData(value).pipe(
                finalize(() => {
                  this.isLoading = false;
                })
              )
            : of([]).pipe(
                finalize(() => {
                  this.isLoading = false;
                })
              )
        )
      )
      .subscribe(
        (results) => {
          this.options = results;
        },
        (error) => {
          console.log(error);
          this.options = [];
        },
        () => {
          console.log('options successfully fetched');
        }
      );
  }
  get tickerSymbol() {
    return this.searchInput.get('tickerSymbol');
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
  displayFn(lookup: Lookup): string {
    return lookup && lookup.symbol ? lookup.symbol : '';
  }
  onSubmit(tickerValue) {
    this.isValidTicker = false;
    if (this.tickerSymbol.valid) {
      var ticker1 = tickerValue.tickerSymbol;
      if (typeof ticker1 == 'object') {
        this.ticker = ticker1.symbol;
      } else {
        this.ticker = ticker1;
      }
      this.getcompany();
    } else {
      this.isValid = true;
    }
  }
  Submit(object) {
    this.autoticker = object.option.value.displaySymbol;
    this.isValidTicker = false;
    this.services
      .getCompanyDescription(this.autoticker)
      .subscribe((tickersymbolFinds) => {
        this.tickersymbolFind = tickersymbolFinds;
        this.tickercheck = this.tickersymbolFind.ticker;
        if (typeof this.tickercheck === 'string') {
          this.router.navigateByUrl(`search/${this.autoticker}`);
          this.inputTicker2();
          //this.searchInput.reset();
          this.isValid = false;
        } else {
          this.isValidTicker = true;
        }
      });
  }
  clearForm() {
    this.isValid = false;
    this.isValidTicker = false;
    this.router.navigateByUrl('');
    this.searchInput.reset();
  }

  inputTicker() {
    this._interactionService.sendMessage(this.ticker);
  }
  inputTicker2() {
    this._interactionService.sendMessage(this.autoticker);
  }

  valid() {
    this.isValid = false;
  }

  getcompany() {
    this.services
      .getCompanyDescription(this.ticker)
      .subscribe((tickersymbolFinds) => {
        this.tickersymbolFind = tickersymbolFinds;
        this.tickercheck = this.tickersymbolFind.ticker;
        if (typeof this.tickercheck === 'string') {
          this.router.navigateByUrl(`search/${this.ticker}`);
          this.inputTicker();
          //this.searchInput.reset();
          this.isValid = false;
        } else {
          this.isValidTicker = true;
        }
      });
  }
}

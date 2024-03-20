import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts/highstock';
@Component({
  selector: 'app-trend-chart',
  templateUrl: './trend-chart.component.html',
  styleUrls: ['./trend-chart.component.css'],
})
export class TrendChartComponent implements OnInit {
  @Input() pardata;

  Highcharts: typeof Highcharts = Highcharts;
  trendChartOptions: Options = {};
  colors = ['#046723', '#18ab4b', '#a77c17', '#cc4a4b', '#682428'];

  constructor() {}

  ngOnInit(): void {
    var strongbuy = [],
      buy = [],
      hold = [],
      sell = [],
      strongsell = [],
      period = [];
    var a, b, c, e, f, g;
    for (var i = 0; i < this.pardata.length; i++) {
      a = this.pardata[i].strongBuy;
      b = this.pardata[i].buy;
      c = this.pardata[i].hold;
      e = this.pardata[i].sell;
      f = this.pardata[i].period;
      g = this.pardata[i].strongSell;
      strongbuy.push(a);
      buy.push(b);
      hold.push(c);
      sell.push(e);
      period.push(f);
      strongsell.push(g);
    }
    this.trendChartOptions = {
      chart: {
        type: 'column',
      },
      colors: this.colors,
      title: {
        text: 'Recommendation Trends',
      },
      xAxis: {
        categories: period,
      },

      yAxis: {
        min: 0,
        title: {
          text: '#Analysis',
          align: 'high',
        },
        stackLabels: {
          enabled: false,
          style: {
            fontWeight: 'bold',
            color:
              // theme
              (Highcharts.defaultOptions.title.style &&
                Highcharts.defaultOptions.title.style.color) ||
              'gray',
          },
        },
      },
      tooltip: {
        headerFormat: '<b>{point.x}</b><br/>',
        valueSuffix: '',
      },
      plotOptions: {
        column: {
          stacking: 'normal',
          dataLabels: {
            enabled: true,
            formatter: function () {
              if (this.y) {
                return this.y;
              }
            },
          },
        },
      },
      series: [
        {
          name: 'Strong Buy',
          type: undefined,
          data: strongbuy,
        },
        {
          name: 'Buy',
          type: undefined,
          data: buy,
        },
        {
          name: 'Hold',
          type: undefined,
          data: hold,
        },
        {
          name: 'Sell',
          type: undefined,
          data: sell,
        },
        {
          name: 'Strong sell',
          type: undefined,
          data: strongsell,
        },
      ],
    };
  }
}

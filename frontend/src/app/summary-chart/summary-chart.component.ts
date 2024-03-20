import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts/highstock';

declare var require: any;
require('highcharts/indicators/indicators')(Highcharts);

@Component({
  selector: 'app-summary-chart',
  templateUrl: './summary-chart.component.html',
  styleUrls: ['./summary-chart.component.css'],
})
export class SummaryChartComponent implements OnInit {
  @Input() sumdata;
  @Input() color: string;
  @Input() ticker;

  Highcharts: typeof Highcharts = Highcharts;
  summaryChartOptions: Options = {};
  constructor() {}

  ngOnInit(): void {
    // this.summaryChartOptions = {
    //   navigator: {
    //     enabled: false,
    //   },
    //   xAxis: {
    //     type: 'datetime',
    //     ordinal: false,
    //     startOnTick: false,
    //     endOnTick: false,
    //     minPadding: 0,
    //     maxPadding: 0,
    //     tickInterval: 3600 * 1000,
    //     minTickInterval: 3600 * 1000,
    //   },
    //   plotOptions: {
    //     column: {
    //       pointRange: (3600 * 1000) / 10,
    //       stacking: 'normal',
    //     },
    //     series: {
    //       color: this.color,
    //     },
    //   },
    //   rangeSelector: {
    //     enabled: false,
    //   },
    //   title: {
    //     text: `${this.ticker} Hourly Price Variation`,
    //   },
    //   time: {
    //     useUTC: false,
    //   },
    //   series: [
    //     {
    //       type: 'line',
    //       name: 'tsla',
    //       data: this.sumdata,
    //       lineWidth: 3,
    //     },
    //   ],
    // };
  }
  ngOnChanges(changes: SimpleChanges) {
    this.summaryChartOptions = {
      navigator: {
        enabled: false,
      },
      xAxis: {
        type: 'datetime',
        ordinal: false,
        startOnTick: false,
        endOnTick: false,
        minPadding: 0,
        maxPadding: 0,
        tickInterval: 3600 * 1000,
        minTickInterval: 3600 * 1000,
      },

      plotOptions: {
        column: {
          pointRange: (3600 * 1000) / 10,
          stacking: 'normal',
        },
        series: {
          color: this.color,
        },
      },

      rangeSelector: {
        enabled: false,
      },
      title: {
        text: `${this.ticker} Hourly Price Variation`,
      },
      time: {
        useUTC: false,
      },
      series: [
        {
          type: 'line',
          name: 'tsla',
          data: this.sumdata,
          lineWidth: 3,
        },
      ],
    };
  }
}

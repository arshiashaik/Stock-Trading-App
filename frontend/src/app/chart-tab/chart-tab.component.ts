import { Component, Input, OnInit } from '@angular/core';
import * as Highcharts from 'highcharts/highstock';
import { Options } from 'highcharts/highstock';

declare var require: any;
require('highcharts/indicators/indicators')(Highcharts);
require('highcharts/indicators/volume-by-price')(Highcharts);

@Component({
  selector: 'app-chart-tab',
  templateUrl: './chart-tab.component.html',
  styleUrls: ['./chart-tab.component.css'],
})
export class ChartTabComponent implements OnInit {
  @Input() inputvalue: string;
  @Input() parentdata;

  ohlc: number[][] = [];
  volume: number[][] = [];
  groupingUnits: [string, number[]][];
  Highcharts: typeof Highcharts = Highcharts;
  chartOptions: Options = {};

  constructor() {}

  ngOnInit(): void {
    this.inputvalue.toUpperCase();
    for (var i = 0; i < this.parentdata.length; i += 1) {
      this.ohlc.push([
        this.parentdata[i][0],
        this.parentdata[i][1],
        this.parentdata[i][2],
        this.parentdata[i][3],
        this.parentdata[i][4],
      ]);
      this.volume.push([this.parentdata[i][0], this.parentdata[i][5]]);
    }
    this.groupingUnits = [
      [
        'week', // unit name
        [1], // allowed multiples
      ],
      ['month', [1, 2, 3, 4, 6]],
    ];
    this.chartOptions = {
      rangeSelector: {
        selected: 2,
      },
      title: {
        text: `${this.inputvalue} Historical`,
      },
      subtitle: {
        text: 'With SMA and Volume by Price technical indicators',
      },
      yAxis: [
        {
          startOnTick: false,
          endOnTick: false,
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'OHLC',
          },
          height: '60%',
          lineWidth: 2,
          resize: {
            enabled: true,
          },
        },
        {
          labels: {
            align: 'right',
            x: -3,
          },
          title: {
            text: 'Volume',
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2,
        },
      ],
      tooltip: {
        split: true,
      },
      plotOptions: {
        series: {
          dataGrouping: {
            units: this.groupingUnits,
          },
        },
      },
      series: [
        {
          type: 'candlestick',
          name: `${this.inputvalue}`,
          id: `${this.inputvalue.toLowerCase()}`,
          zIndex: 2,
          data: this.ohlc,
        },
        {
          type: 'column',
          name: 'Volume',
          id: 'volume',
          data: this.volume,
          yAxis: 1,
        },
        {
          type: 'vbp',
          linkedTo: `${this.inputvalue.toLowerCase()}`,
          params: {
            volumeSeriesID: 'volume',
          },
          dataLabels: {
            enabled: false,
          },
          zoneLines: {
            enabled: false,
          },
        },
        {
          type: 'sma',
          linkedTo: `${this.inputvalue.toLowerCase()}`,
          zIndex: 1,
          marker: {
            enabled: false,
          },
        },
      ],
    };
  }
}

import { Component, OnInit, Input, Optional } from '@angular/core';
import * as Highcharts from 'highcharts';
import { Options } from 'highcharts/highstock';

@Component({
  selector: 'app-earn-chart',
  templateUrl: './earn-chart.component.html',
  styleUrls: ['./earn-chart.component.css'],
})
export class EarnChartComponent implements OnInit {
  @Input() earndata;
  Highcharts: typeof Highcharts = Highcharts;
  earnChartOptions: Options = {};

  constructor() {}

  ngOnInit(): void {
    var period = [];
    var actual = [];
    var estimate = [];
    var surprise = [];
    var a, b, c, d;
    for (var i = 0; i < this.earndata.length; i++) {
      a = this.earndata[i].actual;
      b = this.earndata[i].estimate;
      c = this.earndata[i].period;
      d = this.earndata[i].surprise;
      actual.push(a);
      estimate.push(b);
      period.push(c);
      surprise.push(d);
    }

    var display, value;
    this.earnChartOptions = {
      chart: {
        type: 'spline',
      },
      title: {
        text: 'Historical EPS Surprises',
      },
      xAxis: {
        labels: {
          formatter: function () {
            display = surprise;
            value = null;
            for (var i = 0; i < display.length; i++) {
              value = this.value + '<br/>Surprise: ' + display[i];
            }
            return value;
          },
        },
        categories: period,
        maxPadding: 0.05,
        showLastLabel: true,
      },
      yAxis: {
        title: {
          text: 'Quaterly EPS',
        },
      },
      tooltip: {
        shared: true,
        headerFormat: '<br/>{point.x}<br/>' + `<br/>Surprise:<br/>`,
      },
      series: [
        {
          name: 'Actual',
          type: undefined,
          data: actual,
        },
        {
          name: 'Estimate',
          type: undefined,
          data: estimate,
        },
      ],
    };
  }
}

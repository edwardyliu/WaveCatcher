import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, BaseChartDirective } from 'ng2-charts';
import { EEGSample } from 'muse-js';
import { Observable, interval } from 'rxjs';
import {
  epoch,
  fft,
  PSD,
  bandpassFilter,
  deltaPower,
  thetaPower,
  alphaPower,
  betaPower,
} from '@neurosity/pipes';

@Component({
  selector: 'app-band-bar-chart',
  templateUrl: './band-bar-chart.component.html',
  styleUrls: ['./band-bar-chart.component.css'],
})
export class BandBarChartComponent implements OnInit {
  @Input() data: Observable<EEGSample>;

  heuristics: Observable<number[]>;
  meanPowers = [[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]];

  public barChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          display: true,
          ticks: {
            min: 0,
            // max: 10,
            // stepSize: 2,
          },
        },
      ],
    },
  };

  public barChartColors: Color[] = [
    {
      borderColor: 'rgba(112,185,252,1)',
      backgroundColor: 'rgba(112,185,252,0.3)',
    },
    {
      borderColor: 'rgba(116,150,161,1)',
      backgroundColor: 'rgba(116,150,161,0.3)',
    },
    {
      borderColor: 'rgba(162,86,178,1)',
      backgroundColor: 'rgba(162,86,178,0.3)',
    },
    {
      borderColor: 'rgba(144,132,246,1)',
      backgroundColor: 'rgba(144,132,246,0.3)',
    },
  ];

  public barChartLabels: Label[] = [
    'Delta: [0.1, 4]',
    'Theta: [4, 7.5]',
    'Alpha: [7.5, 12.5]',
    'Beta: [12.5, 30]',
  ];
  public barChartType: ChartType = 'bar';
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartDataSets[] = [
    { data: [0, 0, 0, 0], label: 'Left Temporal' },
    { data: [0, 0, 0, 0], label: 'Left Frontal' },
    { data: [0, 0, 0, 0], label: 'Right Frontal' },
    { data: [0, 0, 0, 0], label: 'Right Temporal' },
  ];

  @ViewChild(BaseChartDirective) private chart: BaseChartDirective;

  constructor() {}

  ngOnInit() {
    const filteredData = this.data.pipe(
      epoch({ duration: 512, interval: 100, samplingRate: 256 }),
      bandpassFilter({
        cutoffFrequencies: [3, 30],
        nbChannels: 5,
        samplingRate: 256,
        order: 4,
      }),
      fft({ bins: 128 })
    );

    filteredData
      .pipe(deltaPower())
      .subscribe(powers => this.addPowers(0, powers));
    filteredData
      .pipe(thetaPower())
      .subscribe(powers => this.addPowers(1, powers));
    filteredData
      .pipe(alphaPower())
      .subscribe(powers => this.addPowers(2, powers));
    filteredData
      .pipe(betaPower())
      .subscribe(powers => this.addPowers(3, powers));

    interval(1000).subscribe(() => this.chart.update());
    this.heuristics = new Observable(subscriber => {
      setInterval(() => {
        const heuristicValues = [0, 0, 0, 0];
        for (let i = 0; i < 4; i++) {
          // checking for no division error
          if (this.meanPowers[3][i] !== 0) {
            // heuristic (theta + alpha)/beta
            heuristicValues[i] = this.meanPowers[1][i] + this.meanPowers[2][i];
            heuristicValues[i] = heuristicValues[i] / this.meanPowers[3][i];
          }
        }
        subscriber.next(heuristicValues);
      }, 1000);
    });
  }

  addPowers(powerIndex: number, powers: any) {
    for (let i = 0; i < 4; i++) {
      this.meanPowers[powerIndex][i] =
        0.75 * this.meanPowers[powerIndex][i] + 0.25 * powers[i];
      this.barChartData[i].data[powerIndex] = powers[i];
    }
  }
}

import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, BaseChartDirective } from 'ng2-charts';
import { Observable, interval } from 'rxjs';

@Component({
  selector: 'app-heuristic-chart',
  templateUrl: './heuristic-chart.component.html',
  styleUrls: ['./heuristic-chart.component.css'],
})
export class HeuristicChartComponent implements OnInit {
  @Input() heuristics: Observable<number[]>;

  currentHeuristic = [0, 0, 0, 0];
  avgHeuristic = 0;
  maxHeuristic = 1;
  minHeuristic = 0;
  percentage = 0;
  allHeuristicDeltas = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ];

  public lineChartData: ChartDataSets[] = [
    { data: this.allHeuristicDeltas[0], label: 'Left Temporal' },
    { data: this.allHeuristicDeltas[1], label: 'Left Frontal' },
    { data: this.allHeuristicDeltas[2], label: 'Right Frontal' },
    { data: this.allHeuristicDeltas[3], label: 'Right Temporal' },
  ];
  public lineChartLabels: Label[] = [
    '20s',
    '19s',
    '18s',
    '17s',
    '16s',
    '15s',
    '14s',
    '13s',
    '12s',
    '11s',
    '10s',
    '9s',
    '8s',
    '7s',
    '6s',
    '5s',
    '4s',
    '3s',
    '2s',
    '1s',
  ];
  public lineChartOptions: ChartOptions = {
    responsive: true,
    scales: {
      yAxes: [
        {
          display: true,
          ticks: {
            min: -3,
            max: 3,
            stepSize: 1,
          },
        },
      ],
    },
  };
  public lineChartColors: Color[] = [
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
  public lineChartLegend = true;
  public lineChartType: ChartType = 'line';
  public lineChartPlugins = [];

  @ViewChild(BaseChartDirective) private chart: BaseChartDirective;

  constructor() {}

  ngOnInit() {
    this.heuristics.subscribe(heuristic => {
      this.avgHeuristic = 0;
      for (let i = 0; i < 4; i++) {
        this.allHeuristicDeltas[i].shift();
        this.allHeuristicDeltas[i].push(
          this.currentHeuristic[i] - heuristic[i]
        );
        this.lineChartData[i].data = this.allHeuristicDeltas[i];
        this.avgHeuristic += heuristic[i];
      }
      this.currentHeuristic = heuristic;
      this.avgHeuristic = this.avgHeuristic / 4;

      if (this.avgHeuristic < this.minHeuristic) {
        this.minHeuristic = this.avgHeuristic;
      }
      if (this.avgHeuristic > this.maxHeuristic) {
        this.maxHeuristic = this.avgHeuristic;
      }

      this.percentage =
        (100 * (this.avgHeuristic - this.minHeuristic)) /
        (this.maxHeuristic - this.minHeuristic);

      this.chart.update();
    });
  }

  reset() {
    this.minHeuristic = this.avgHeuristic - 0.001;
    this.maxHeuristic = this.avgHeuristic + 0.001;
  }
}

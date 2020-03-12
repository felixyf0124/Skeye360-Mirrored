/* eslint-disable  @typescript-eslint/camelcase */
import React from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';

// Realtime graph from the ApexCharts Documentation Website
// https://apexcharts.com/react-chart-demos/line-charts/realtime/
// https://github.com/apexcharts/apexcharts.js/blob/master/samples/react/line/realtime.html

let arima_dataset: any[] = [];
let mavg_dataset: any[] = [];
const current_mavg: any[] = [];
const current_arima: any[] = [];

let COUNT = 0;

arima_dataset = [
  [0, 35],
  [1, 23],
  [2, 24],
  [3, 35],
  [4, 23],
  [5, 24],
  [6, 35],
  [7, 23],
  [8, 24],
  [9, 35],
  [10, 23],
  [11, 24],
  [12, 35],
  [13, 35],
  [14, 23],
  [15, 24],
  [16, 35],
  [17, 23],
  [18, 24],
  [19, 35],
  [20, 23],
  [21, 24],
  [22, 35],
  [23, 23],
];

mavg_dataset = [
  [0, 30],
  [1, 25],
  [2, 20],
  [3, 39],
  [4, 19],
  [5, 30],
  [6, 30],
  [7, 20],
  [8, 21],
  [9, 34],
  [10, 25],
  [11, 29],
  [12, 34],
  [13, 39],
  [14, 23],
  [15, 25],
  [16, 30],
  [17, 22],
  [18, 21],
  [19, 35],
  [20, 25],
  [21, 24],
  [22, 34],
  [23, 22],
];

// Logic to be implemented:
// Check the current time, if the minutes are equal to 00,
// then retrieve the new data for the current hour.
// Check if the values in the graph are populated or not
const getMovAvg = (): void => {
  if (COUNT === 0) {
    /* eslint-disable no-plusplus */
    for (let i = 0; i < arima_dataset.length; i++) {
      current_arima.push(arima_dataset[i]);
    }
  }
  if (COUNT < mavg_dataset.length) {
    current_mavg.push(mavg_dataset[COUNT]);
  }
};

interface ChartState {
  options: any;
  series: any;
}

class RealTimeLine extends React.Component<{}, ChartState> {
  constructor(props: any) {
    super(props);
    this.state = {
      options: {
        chart: {
          id: 'realtime',
          height: 350,
          type: 'line',
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000,
            },
          },
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
        },
        title: {
          align: 'center',
          text: 'Prediction vs Moving Average',
        },
        markers: {
          size: 0,
        },
        xaxis: {
          range: 23,
          title: {
            text: 'Hours',
            align: 'center',
          },
        },
        yaxis: {
          min: 10,
          max: 50,
          title: {
            text: 'Cars',
          },
        },
        legend: {
          show: true,
        },
      },
      series: [
        {
          name: 'Prediction',
          data: current_arima,
        },
        {
          name: 'Moving Average',
          data: current_mavg,
        },
      ],
    };
  }

  // The data gets retrieved here, in future implementations: Use async fetch from the database
  public componentDidMount(): void {
    window.setInterval((): any => {
      // Data gets populated here
      // Datasets current_arima and current_mavg get updated here
      getMovAvg();

      // Execute the realtime function here, using the two below data arrays as datasets
      /* eslint-disable no-undef */
      ApexCharts.exec('realtime', 'updateSeries', [
        { data: current_arima },
        { data: current_mavg },
      ]);
      COUNT++;
    }, 100);
  }

  /* eslint-disable react/destructuring-assignment */
  public render(): JSX.Element {
    return <Chart options={this.state.options} series={this.state.series} type="line" />;
  }
}
export default RealTimeLine;

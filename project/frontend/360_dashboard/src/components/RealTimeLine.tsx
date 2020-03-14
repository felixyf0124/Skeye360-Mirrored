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
let current_bar: any[] = [];
current_bar = [];

let COUNT = 0;

// Static arima dataset
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

// Static moving average dataset
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

let bar_data: any[] = [];
bar_data = [
  [16, 33],
  [34, 33],
  [14, 32],
  [32, 31],
  [13, 30],
  [18, 20],
  [20, 30],
  [14, 23],
  [12, 30],
  [18, 20],
  [34, 20],
  [23, 10],
  [10, 60],
  [10, 20],
  [40, 36],
  [10, 24],
  [12, 32],
  [25, 20],
  [12, 30],
  [34, 11],
  [4, 18],
  [12, 16],
  [25, 9],
  [13, 40],
];

// Logic to be implemented:
// Check the current time, if the minutes are equal to 00,
// then retrieve the new data for the current hour.
// Check if the values in the graph are populated or not
const getMovAvg = (): void => {
  if (COUNT === 0) {
    /* eslint-disable no-plusplus */
    // Populate the entire arima dataset if count is equal to zero
    for (let i = 0; i < arima_dataset.length; i++) {
      current_arima.push(arima_dataset[i]);
    }
  }
  // Populate the moving average displayed on graph one by one
  if (COUNT < 24) {
    current_bar = [];
    // populate the line chart
    current_mavg.push(mavg_dataset[COUNT]);

    // populate the bar chart
    current_bar.push(bar_data[COUNT][0]);
    current_bar.push(bar_data[COUNT][1]);
  }
};

// For every graph, there needs to be options and series
// Options represents the type of chart with all its options
// Series represents the given data to the graph
interface ChartState {
  line1Options: any;
  line2Options: any;

  line1Series: any;
  line2Series: any;

  barOptions: any;
  barSeries: any;
}

class RealTimeLine extends React.Component<{}, ChartState> {
  constructor(props: any) {
    super(props);
    this.state = {
      line1Options: {
        chart: {
          id: 'line1',
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
          text: 'Prediction vs Moving Average in North-South',
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
      line1Series: [
        {
          name: 'Prediction',
          data: current_arima,
        },
        {
          name: 'Moving Average',
          data: current_mavg,
        },
      ],
      line2Options: {
        chart: {
          id: 'line2',
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
          text: 'Prediction vs Moving Average in East-West',
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
      line2Series: [
        {
          name: 'Prediction',
          data: current_arima,
        },
        {
          name: 'Moving Average',
          data: current_mavg,
        },
      ],

      barOptions: {
        chart: {
          id: 'bar-chart',
          type: 'bar',
          height: 350,
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories: ['North-South', 'East-West'],
        },
        yaxis: {
          min: 0,
          max: 100,
        },
      },
      barSeries: [
        {
          data: current_bar[0],
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
      // ApexCharts.exec() takes in chart ID, method, and data as parameters
      /* eslint-disable no-undef */
      // Update Line Chart 1
      ApexCharts.exec('line1', 'updateSeries', [{ data: current_arima }, { data: current_mavg }]);

      // Update Line Chart 2
      ApexCharts.exec('line2', 'updateSeries', [{ data: current_arima }, { data: current_mavg }]);
      ApexCharts.exec('bar-chart', 'updateSeries', [{ data: current_bar }]);
      COUNT++;
    }, 100);
  }

  /* eslint-disable react/destructuring-assignment */
  public render(): JSX.Element {
    return (
      <div>
        <Chart options={this.state.line1Options} series={this.state.line1Series} type="line" />
        ;
        <Chart options={this.state.line2Options} series={this.state.line2Series} type="line" />
        ;
        <Chart options={this.state.barOptions} series={this.state.barSeries} type="bar" />
      </div>
    );
  }
}
export default RealTimeLine;

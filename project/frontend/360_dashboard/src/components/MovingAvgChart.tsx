/* eslint-disable no-plusplus */
/* eslint-disable max-len */
import React from 'react';
import Chart from 'react-apexcharts';

// For more Line Chart information:
// https://apexcharts.com/react-chart-demos/line-charts/basic/

// This is a chart that displays values for the moving average
const MovingAvgChart = (values: any): JSX.Element => {
  const data1x = [];
  const data2x = [];
  const data3x = [];

  const data1y = [];
  const data2y = [];
  const data3y = [];

  /* eslint-disable radix */
  for (let i = 0; i < values.values[0].time.length; i++) {
    data1x.push(parseInt(values.values[0].time[i]));
    data1y.push(parseInt(values.values[0].count[i]));
  }

  for (let i = 0; i < values.values[1].time.length; i++) {
    data2x.push(parseInt(values.values[1].time[i]));
    data2y.push(parseInt(values.values[1].count[i]));
  }
  for (let i = 0; i < values.values[2].time.length; i++) {
    data3x.push(parseInt(values.values[2].time[i]));
    data3y.push(parseInt(values.values[2].count[i]));
  }

  const state = {
    options: {
      chart: {
        background: '#FFF',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: true,
      },
      title: {
        text: 'Moving Average',
        align: 'center',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        title: {
          text: '',
        },
      },
      yaxis: {
        title: {
          text: 'Car Count',
        },
      },
      colors: ['#04a777', '#51bcd8', '#808080'],
    },
    series: [
      {
        name: 'North-South',
        data: [
          [data1x[0], data1y[0]], [data1x[1], data1y[1]], [data1x[2], data1y[2]], [data1x[3], data1y[3]], [data1x[4], data1y[4]],
          [data1x[5], data1y[5]], [data1x[6], data1y[6]], [data1x[7], data1y[7]], [data1x[8], data1y[8]], [data1x[9], data1y[9]],
          [data1x[10], data1y[10]], [data1x[11], data1y[11]], [data1x[12], data1y[12]], [data1x[13], data1y[13]], [data1x[14], data1y[14]],
          [data1x[15], data1y[15]], [data1x[16], data1y[16]], [data1x[17], data1y[17]], [data1x[18], data1y[18]], [data1x[19], data1y[19]],
          [data1x[20], data1y[20]], [data1x[21], data1y[21]], [data1x[22], data1y[22]], [data1x[23], data1y[23]],
        ],
      },
      {
        name: 'South-North',
        data: [
          [data2x[0], data2y[0]], [data2x[1], data2y[1]], [data2x[2], data2y[2]], [data2x[3], data2y[3]], [data2x[4], data2y[4]],
          [data2x[5], data2y[5]], [data2x[6], data2y[6]], [data2x[7], data2y[7]], [data2x[8], data2y[8]], [data2x[9], data2y[9]],
          [data2x[10], data2y[10]], [data2x[11], data2y[11]], [data2x[12], data2y[12]], [data2x[13], data2y[13]], [data2x[14], data2y[14]],
          [data2x[15], data2y[15]], [data2x[16], data2y[16]], [data2x[17], data2y[17]], [data2x[18], data2y[18]], [data2x[19], data2y[19]],
          [data2x[20], data2y[20]], [data2x[21], data2y[21]], [data2x[22], data2y[22]], [data2x[23], data2y[23]],
        ],
      },
      {
        name: 'East-North',
        data: [
          [data3x[0], data3y[0]], [data3x[1], data3y[1]], [data3x[2], data3y[2]], [data3x[3], data3y[3]], [data3x[4], data3y[4]],
          [data3x[5], data3y[5]], [data3x[6], data3y[6]], [data3x[7], data3y[7]], [data3x[8], data3y[8]], [data3x[9], data3y[9]],
          [data3x[10], data3y[10]], [data3x[11], data3y[11]], [data3x[12], data3y[12]], [data3x[13], data3y[13]], [data3x[14], data3y[14]],
          [data3x[15], data3y[15]], [data3x[16], data3y[16]], [data3x[17], data3y[17]], [data3x[18], data3y[18]], [data3x[19], data3y[19]],
          [data3x[20], data3y[20]], [data3x[21], data3y[21]], [data3x[22], data3y[22]], [data3x[23], data3y[23]],
        ],
      },
    ],
  };
  return <Chart options={state.options} series={state.series} type="line" />;
};

export default MovingAvgChart;

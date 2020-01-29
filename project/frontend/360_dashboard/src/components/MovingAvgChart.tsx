import React from 'react';
import Chart from 'react-apexcharts';

// For more Line Chart information:
// https://apexcharts.com/react-chart-demos/line-charts/basic/

// This is a chart that displays values for the moving average
const MovingAvgChart = (values: any): JSX.Element => {
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
        title: {
          text: 'Time (Hours)',
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
        data: values.values,
      },
    ],
  };
  return <Chart options={state.options} series={state.series} type="line" />;
};

export default MovingAvgChart;

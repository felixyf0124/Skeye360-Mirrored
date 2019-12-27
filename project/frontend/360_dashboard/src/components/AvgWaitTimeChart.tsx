import React from 'react';
import Chart from 'react-apexcharts';
import AvgWaitingTime from '../PostData/avgWaitingTime.json';
import AvgWaitingTimeAfter from '../PostData/avgWaitingTimeAfter.json';

// For more Line Chart information:
// https://apexcharts.com/react-chart-demos/line-charts/basic/

const data = AvgWaitingTime.WaitTime;
const newData = AvgWaitingTimeAfter.WaitTime;
const getX = data.map((value) => value.hour);
// const getY = data.map((value) => value.wait);
const getYAfter = newData.map((value) => value.wait);

interface ChartState {
  options: {};
  series: any;
}

// A chart that shows the average waiting time for cars going from north to south
const AvgWaitTimeChart = (): JSX.Element => {
  const state = {
    options: {
      chart: {
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      title: {
        text: 'Average Wait Time Per Hour',
        align: 'center',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: getX,
        title: {
          text: 'Hours of the Day',
        },
      },
      yaxis: {
        title: {
          text: 'Wait Time (seconds)',
        },
      },
      colors: ['#04a777'],
    },
    series: [
      {
        name: 'Avg Wait Time',
        data: getYAfter,
      },
    ],
  };
  return <Chart options={state.options} series={state.series} type="line" />;
};

export default AvgWaitTimeChart;

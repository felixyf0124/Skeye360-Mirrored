import React from 'react';
import Chart from 'react-apexcharts';
import SouthData from '../PostData/carsSouth.json';

// For more Line Chart information:
// https://apexcharts.com/react-chart-demos/line-charts/basic/

// gets the arrays found in SouthData
const data = SouthData.SouthData;

// Retrieve all of the x values
const getX = data.map((value) => value.x);
// Retrieve all of the y values
const getY = data.map((value) => value.y);

interface ChartState {
  options: {};
  series: any;
}

// A chart that shows how many cars are coming from South to North per hour
const SouthChart = (): JSX.Element => {
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
        text: 'Cars going North to South per hour',
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
      },
      stroke: {
        width: 5,
        curve: 'smooth',
      },
    },
    series: [
      {
        name: 'Cars',
        data: getY,
      },
    ],
  };
  return <Chart options={state.options} series={state.series} type="line" />;
};
export default SouthChart;

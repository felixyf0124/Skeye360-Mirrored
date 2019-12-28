import React from 'react';
import Chart from 'react-apexcharts';
import NorthData from '../PostData/carsNorth.json';
import NorthDataAfter from '../PostData/carsNorthAfter.json';
// For more Line Chart information:
// https://apexcharts.com/react-chart-demos/line-charts/basic/

const data = NorthData.NorthDataBefore;
const newData = NorthDataAfter.NorthDataAfter;
const getX = data.map((value) => value.time);
// const getY = data.map((value) => value.cars);
const getYAfter = newData.map((value) => value.cars);

interface ChartState {
  options: {};
  series: any;
}

// A chart that shows how many cars are coming from north to south per hour
const NorthChart = (): JSX.Element => {
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
        text: 'Cars Passing from North to South',
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
          text: 'Number of Cars',
        },
      },
      colors: ['#04a777'],
    },
    series: [
      {
        name: 'Number of cars passing',
        data: getYAfter,
      },
    ],
  };

  return <Chart options={state.options} series={state.series} type="line" />;
};

export default NorthChart;

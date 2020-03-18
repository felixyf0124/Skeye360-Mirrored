import Chart from 'react-apexcharts';
import React from 'react';

interface ChartState {
    options: {};
    series: any;
}

const LineChart = (): JSX.Element => {
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
        text: 'Number of cars per hour',
        align: 'center',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: ['0', '6', '12', '18', '24'],
      },
    },
    series: [{
      name: 'Cars',
      data: [10, 15, 14, 45, 23],
    }],
  };

  return (
    <div className="bar-chart">
      <Chart options={state.options} series={state.series} type="line" width="500" height="" />
    </div>
  );
};

export default LineChart;

import Chart from 'react-apexcharts';
import React from 'react';

interface ChartState{
    options: {};
    series: any;
}

const PieChart = (): JSX.Element => {
  const state = {
    options: {
      title: {
        text: 'Colors of cars',
        align: 'center',
      },
      labels: ['Blue Cars', 'Red Cars', 'Green Cars', 'Pink Cars'],
      responsive: [{
        breakpoint: 480,
        options: {
          chart: {
            width: 200,
          },
          legend: {
            position: 'bottom',
          },
        },
      }],
    },
    series: [10, 20, 15, 17],
  };
  return (
    <div className="bar-chart">
      <Chart options={state.options} series={state.series} type="pie" width="500" />
    </div>
  );
};

export default PieChart;

import Chart from 'react-apexcharts';
import React from 'react';

interface ChartState {
    options: {};
    series: any;
}

const MixedChart = (): JSX.Element => {
  const state = {
    options: {
      stroke: {
        width: [0, 4],
      },
      title: {
        text: 'Traffic',
        align: 'center',
      },
      labels: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22'],
      xaxis: {
        type: 'Hours',
        title: {
          text: 'Hours',
        },
      },
      yaxis: [
        {
          title: {
            text: 'Number of cars',
          },
        },
        {
          opposite: true,
          title: {
            text: 'max cars',
          },
        },
      ],
    },
    series: [
      {
        name: 'Total Cars',
        type: 'column',
        data: [300, 505, 414, 631, 257, 455, 201, 300, 744, 380, 230, 200],
      },
      {
        name: 'Max Congestion',
        type: 'line',
        data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16],
      },
    ],
  };
  return (
    <div className="bar-chart">
      <Chart options={state.options} series={state.series} type="line" width="500" />
    </div>
  );
};

export default MixedChart;

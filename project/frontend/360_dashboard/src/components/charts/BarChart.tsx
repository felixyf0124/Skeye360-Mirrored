import Chart from 'react-apexcharts';
import React from 'react';
// For more information

interface ChartState {
    options: {};
    series: any;
}
const Bar = (): JSX.Element => {
  const state = {
    options: {
      dataLabels: {
        enabled: false,
      },
      plotOptions: {
        bar: {
          horizontal: true,
        },
      },
      xaxis: {
        categories: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
    },
    series: [{
      data: [30, 40, 25, 50, 49, 21, 70, 51],
    }],
  };

  return (
    <div className="bar-chart">
      <Chart options={state.options} series={state.series} type="bar" width="500" />
    </div>
  );
};

export default Bar;

import React, { Component } from 'react';
import Chart from 'react-apexcharts';
// For more information

interface ChartProps {

}
interface ChartState {
    options: {};
    series: any;
}
class Bar extends Component<ChartProps, ChartState> {
  constructor(props: ChartProps) {
    super(props);

    this.state = {
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
  }

  render() {
    return (
      <div className="bar-chart">
        <Chart options={this.state.options} series={this.state.series} type="bar" width="500" />
      </div>
    );
  }
}

export default Bar;

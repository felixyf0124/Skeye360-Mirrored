import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import { render } from 'react-dom';
import { isParenthesizedExpression } from '@babel/types';
//For more Line Chart information:
//https://apexcharts.com/react-chart-demos/mixed-charts/line-column/

interface ChartProps{

}
interface ChartState {
    options: {};
    series: any;
}

class MixedChart extends Component<ChartProps, ChartState>{
  constructor(props: ChartProps){
    super(props);
    this.state = {
      options: {
        stroke: {
          width: [0, 4]
        },
        title: {
          text: 'Traffic',
          align: 'center'
        },
        labels: ['0', '2', '4', '6', '8', '10', '12', '14', '16', '18', '20', '22'],
        xaxis: {
          type: 'Hours',
          title: {
            text: 'Hours',
          }
        },
        yaxis: [
          {
            title: {
              text: 'Number of cars',
            },
          },
          {
            opposite: true,
            title:{
              text:'max cars'
            }
          }
        ]
      },
      series: [
        {
          name: 'Total Cars',
          type: 'column',
          data: [300, 505, 414, 631, 257, 455, 201, 300, 744, 380, 230, 200]
        },
        {
          name: 'Max Congestion',
          type: 'line',
          data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
        }
      ],
    }
  }
  render(){
    return (
      <div className="bar-chart">
        <Chart options={this.state.options} series={this.state.series} type="line" width="700" height="" />
      </div>
    )
  }
}
export default MixedChart;
import React from 'react';
import Chart from 'react-apexcharts';

interface ChartState{
  options: any,
  series: any
}
class RealTimeLine extends React.Component<{}, ChartState> {
  constructor(props: any){
    super(props);
    this.state = {
      options: {
        chart: {
          id: 'realtime',
        }
      },
      series: {

      }
    }
  }
  render(){
    return(
      <Chart options = {this.state.options} series={this.state.series} />
    )
  }

}
import React, { Component } from 'react';
import Chart from 'react-apexcharts';
//For more Line Chart information:
//https://apexcharts.com/react-chart-demos/line-charts/basic/

interface ChartProps{

}
interface ChartState {
    options: {};
    series: any;
}

class LineChart extends Component<ChartProps, ChartState> {
    constructor(props: ChartProps){
        super(props);

        this.state = {
            options: {
                chart: {
                    zoom: {
                        enabled: false
                    }
                },
                dataLabels: {
                    enabled: false
                },
                title: {
                    text: 'Number of cars per hour',
                    align: 'center'
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'],
                        opacity: 0.5
                    },
                },
                xaxis: {
                    categories: ['0','6','12','18','24']
                }
            },
            series: [{
                name: "Cars",
                data: [10, 15, 14, 45, 23 ]
            }],
        }
    }
    render(){
        return (
            <div className="bar-chart">
                <Chart options={this.state.options} series={this.state.series} type="line" width="500" height="" />
            </div>
        )
    }
}
export default LineChart;

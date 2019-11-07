import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import AvgWaitingTime from '../PostData/avgWaitingTime.json';
import AvgWaitingTimeAfter from '../PostData/avgWaitingTimeAfter.json';

//For more Line Chart information:
//https://apexcharts.com/react-chart-demos/line-charts/basic/

const data = AvgWaitingTime.WaitTime;
const newData = AvgWaitingTimeAfter.WaitTime;
const getX = data.map((value) =>{
    return value.hour;
});
const getY = data.map((value) => {
    return value.wait;
});
const getYAfter = newData.map((value) => {
    return value.wait;
});

interface ChartProps{

}
interface ChartState {
    options: {};
    series: any;
}

//A chart that shows how many cars are coming from north to south per hour
class NorthChart extends Component<ChartProps, ChartState> {
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
                    text: 'Average Wait Time Per Hour',
                    align: 'center'
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'],
                        opacity: 0.5
                    },
                },
                xaxis: {
                    categories: getX,
                    title: {
                        "text": "Hours of the Day"
                    }
                },
                yaxis: {
                    title:{
                        "text": "Wait Time (seconds)"
                    }
                },
                colors: ['#c7382e', '#b2e6a3']
            },
            series: [{
                name: "Avg Wait Time Before SkeYe",
                data: getY
            },{
                name: "Avg Wait Time After SkeYe",
                data: getYAfter
            }
        ],
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
export default NorthChart;

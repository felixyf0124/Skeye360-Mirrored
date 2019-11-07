import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import NorthData from '../PostData/carsNorth.json';
import NorthDataAfter from '../PostData/carsNorthAfter.json'
import { valueToNode } from '@babel/types';
//For more Line Chart information:
//https://apexcharts.com/react-chart-demos/line-charts/basic/

const data = NorthData.NorthDataBefore;
const newData = NorthDataAfter.NorthDataAfter;
const getX = data.map((value) =>{
    return value.time;
});
const getY = data.map((value) => {
    return value.cars;
});
const getYAfter = newData.map((value) => {
    return value.cars;
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
                    text: 'Volume of Cars Going From North To South',
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
                    title: {
                        "text": "Number of Cars"
                    }
                },
                colors: ['#c7382e', '#b2e6a3']
            },
            series: [{
                name: "Cars Before SkeYe",
                data: getY,
            },{
                name: "Cars After SkeYe",
                data: getYAfter,
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

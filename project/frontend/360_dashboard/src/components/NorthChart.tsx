import React, { Component } from 'react';
import Chart from 'react-apexcharts';
import NorthData from '../PostData/carsNorth.json';
//For more Line Chart information:
//https://apexcharts.com/react-chart-demos/line-charts/basic/

const data = NorthData.NorthData;
const getX = data.map((value) =>{
    return value.x;
});
const getY = data.map((value) => {
    return value.y;
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
                    text: 'Cars going North to South per hour',
                    align: 'center'
                },
                grid: {
                    row: {
                        colors: ['#f3f3f3', 'transparent'],
                        opacity: 0.5
                    },
                },
                xaxis: {
                    categories: getX
                }
            },
            series: [{
                name: "Cars",
                data: getY
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
export default NorthChart;

import React, { Component } from 'react';
import Chart from 'react-apexcharts';

interface ChartProps{}

interface ChartState{
    options: {};
    series: any;
}

class PieChart extends Component<ChartProps, ChartState>{
    constructor(props: ChartProps){
        super(props);

        this.state = {
            options: {
                title: {
                    text: 'Colors of cars',
                    align: 'center'
                },
                labels: ['Blue Cars', 'Red Cars', 'Green Cars', 'Pink Cars'],
                responsive: [{
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend:{
                            position: 'bottom'
                        }
                    }
                }]
            },
            series: [10, 20, 15, 17]
            }
        }
    
    render(){
        return(
        <div className="bar-chart">
            <Chart options={this.state.options} series={this.state.series} type="pie" width="500"/>
        </div>
        );
    }
}



export default PieChart;
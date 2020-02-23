import React from 'react';
import Chart from 'react-apexcharts';


//Static code and data generator retrieved from: 
//https://github.com/apexcharts/apexcharts.js/blob/master/samples/react/line/realtime.html
//From the ApexCharts Documentation Website
//https://apexcharts.com/react-chart-demos/line-charts/realtime/
//To be modified for future usage

var LASTDATE = 0;
var DATA: any[] = [];
var data2: any[] = [];
var TICKINTERVAL = 86400000; //number of milliseconds in a day
let XAXISRANGE = 777600000;
function getDayWiseTimeSeries(baseval: any, count: any, yrange: any) {
  var i = 0;
  while (i < count) {
    var x = baseval;
    var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    DATA.push({
      x, y
    });
    y = 50;
    data2.push({
      x, y
    })
    LASTDATE = baseval;
    baseval += TICKINTERVAL; //baseval = baseval + tickinterval
    i++;
  }
}

function getDirectionNumbers(count: any){
  var i = 0;
  var x = 0;
  var y = 0;
  while(i < count) {
    x = Math.floor(Math.random() * 10);
    y = Math.floor(Math.random() * 10);
    DATA.push([x, y]);
    i++;
  }
}

//begin with this function
getDirectionNumbers(10);

function resetDATA(){
  // Alternatively, you can also reset the DATA at certain intervals to prevent creating a huge series 
  DATA = DATA.slice(DATA.length - 10, DATA.length);
}
interface ChartState{
  options: any,
  series: any
}
class RealBarChart extends React.Component<{}, ChartState> {
  constructor(props: any){
    super(props);
    this.state = {
      options: {
        chart: {
          id: 'realtime',
          height: 350,
          type: 'bar',
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000
            }
          },
          toolbar: {
            show: false
          },
          zoom: {
            enabled: false
          }
        },
        plotOptions: {
          bar: {
            horizontal: true,
            barHeight: '20%',
            colors: {
              backgroundBarColors: ['#40475D']
            }
          }
        },
        dataLabels: {
          enabled: false
        },
      
        title: {
          text: 'Number of cars in each direction'
        },
   
        xaxis: {
          categories: ['South to North', 'North to South'],
        },
      
        legend: {
          show: false
        }
      },
      series:[{
        name: 'Number of Cars',
        data: DATA
      },
    ]
    }
  }
  componentDidMount() {
    window.setInterval(() => {
      getDirectionNumbers(10);
      ApexCharts.exec('realtime', 'updateSeries', [
        {
          data: DATA
        }
    ]);
      
    }, 10000)
  }
  render(){
    return(
      <Chart options = {this.state.options} series={this.state.series} type="bar"/>
    )
  }
}
export default RealBarChart; 
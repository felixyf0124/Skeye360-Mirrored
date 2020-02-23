import React from 'react';
import Chart from 'react-apexcharts';
import NorthDataBefore from '../PostData/carsNorth.json';

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

//populate the initial first 10 values of x and y starting with this date, with range

getDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10, {
  min: 10,
  max: 90
}) 

function tryTime(baseval: any, count: any, yrange: any){
  var i = 0;
  while(i < count){
    var x = baseval - (15 * TICKINTERVAL); 
    //for var y, we would need to fetch some data. 
    //
  }
}

function getNewSeries(baseval: any, yrange: any) {
  var newDate = baseval + TICKINTERVAL;
  LASTDATE = newDate;

  for(var i = 0; i< DATA.length - 10; i++) {
    DATA[i].x = newDate - XAXISRANGE - TICKINTERVAL;
    DATA[i].y = 0;
    data2[i].x = newDate - XAXISRANGE - TICKINTERVAL;
    data2[i].y = 0;
  }

  //Pushes values into the first array (data1)
  DATA.push({
    x: newDate,
    y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
  })

  //Pushes values into the second array (data2)
  data2.push({
    x: newDate,
    y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min,
  })
}

function resetDATA(){
  // Alternatively, you can also reset the DATA at certain intervals to prevent creating a huge series 
  DATA = DATA.slice(DATA.length - 10, DATA.length);
}
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
          height: 350,
          type: 'line',
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
        dataLabels: {
          enabled: false
        },
        stroke: {
          curve: 'smooth'
        },
        title: {
          text: 'Moving Average'
        },
        markers: {
          size: 0
        },
        xaxis: {
          type: 'datetime',
          range: XAXISRANGE
        },
        yaxis: {
          max: 90
        },
        legend: {
          show: false
        }
      },
      series:[{
        name: 'Prediction',
        data: DATA.slice(),
      },
    {
      name: 'Moving Average',
      data: data2.slice(),
    }]
    }
  }
  componentDidMount() {
    window.setInterval(() => {
      getNewSeries(LASTDATE, {
        min: 10,
        max: 100
      })

      ApexCharts.exec('realtime', 'updateSeries', [
        {
          data: DATA
        },
        {
          data: data2,
        }
    ]);
      
    }, 10000)
  }
  render(){
    return(
      <Chart options = {this.state.options} series={this.state.series} type="line"/>
    )
  }
}
export default RealTimeLine; 
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

var arima_dataset: any[] = [];
var mavg_dataset: any[] = [];
var current_mavg: any[] = [];

var COUNT = 0; 

var TICKINTERVAL = 86400000; //number of milliseconds in a day
let XAXISRANGE = 777600000;

arima_dataset = [
  [0, 35],
  [1, 23],
  [2, 24],
  [3, 35],
  [4, 23],
  [5, 24],
  [6, 35],
  [7, 23],
  [8, 24],
  [9, 35],
  [10, 23],
  [11, 24],
  [12, 35]
]

mavg_dataset = [
  [0, 30],
  [1, 25],
  [2, 20],
  [3, 39],
  [4, 19],
  [5, 30],
  [6, 30],
  [7, 20],
  [8, 21],
  [9, 34],
  [10, 25],
  [11, 29],
  [12, 34]
]

const getArima = () => {
  //Logic to be implemented: 
  //Check the current time, if the time is equal to 12:00 AM, then do the GET request via async fetch, retrieve ALL the dataset for the day. 
}
const getMovAvg = () => {
  //Logic to be implemented: 
  //Check the current time, if the minutes are equal to 00, then retrieve the new data for the current hour. 
  //Check if the values in the graph are populated or not

  if(COUNT < 13){
    current_mavg.push(mavg_dataset[COUNT]);
  }


}

function getDayWiseTimeSeries(baseval: any, count: any, yrange: any) {
  var i = 0;
  while (i < count) {
    var x = baseval;
    var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    DATA.push({
      x, y
    });
    y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;
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
          text: 'Moving Average and Prediction'
        },
        markers: {
          size: 0
        },
        xaxis: {
          range: 10
        },
        legend: {
          show: false
        }
      },
      series:[
      {
        name: 'Prediction',
        data: arima_dataset,
      },
      {
        name: 'Moving Average',
        data: current_mavg,
      }
      ]
    }
  }
  componentDidMount() {
    window.setInterval(() => {
      getMovAvg();

  
      ApexCharts.exec('realtime', 'updateSeries', [
        {
          data: current_mavg,
        },
        {
          data: arima_dataset,
        }
    ]);

    COUNT++; 

    }, 1000)
  }
  render(){
    return(
      <Chart options = {this.state.options} series={this.state.series} type="line"/>
    )
  }
}
export default RealTimeLine; 
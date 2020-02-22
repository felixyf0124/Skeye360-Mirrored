import React from 'react';
import Chart from 'react-apexcharts';

//Static code and data retrieved from: 
//https://github.com/apexcharts/apexcharts.js/blob/master/samples/react/line/realtime.html
//From the ApexCharts Documentation Website
//https://apexcharts.com/react-chart-demos/line-charts/realtime/
//To be modified for future usage

var lastDate = 0;
var data: any[] = [];
var TICKINTERVAL = 86400000;
let XAXISRANGE = 777600000;
function getDayWiseTimeSeries(baseval: any, count: any, yrange: any) {
  var i = 0;
  while (i < count) {
    var x = baseval;
    var y = Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min;

    data.push({
      x, y
    });
    lastDate = baseval
    baseval += TICKINTERVAL;
    i++;
  }
}

getDayWiseTimeSeries(new Date('11 Feb 2017 GMT').getTime(), 10, {
  min: 10,
  max: 90
})

function getNewSeries(baseval: any, yrange: any) {
  var newDate = baseval + TICKINTERVAL;
  lastDate = newDate

  for(var i = 0; i< data.length - 10; i++) {
    data[i].x = newDate - XAXISRANGE - TICKINTERVAL;
    data[i].y = 0
  }

  data.push({
    x: newDate,
    y: Math.floor(Math.random() * (yrange.max - yrange.min + 1)) + yrange.min
  })
}

function resetData(){
  // Alternatively, you can also reset the data at certain intervals to prevent creating a huge series 
  data = data.slice(data.length - 10, data.length);
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
        data: data.slice(),
      }]
    }
  }
  componentDidMount() {
    window.setInterval(() => {
      getNewSeries(lastDate, {
        min: 10,
        max: 90
      })

      ApexCharts.exec('realtime', 'updateSeries', [{
        data: data
      }])
    }, 10000)
  }
  render(){
    return(
      <Chart options = {this.state.options} series={this.state.series} type="line"/>
    )
  }
}
export default RealTimeLine; 
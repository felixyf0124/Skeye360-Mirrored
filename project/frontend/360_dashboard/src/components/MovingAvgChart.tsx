import React from 'react';
import Chart from 'react-apexcharts';
import AvgWaitingTime from '../PostData/avgWaitingTime.json';
import AvgWaitingTimeAfter from '../PostData/avgWaitingTimeAfter.json';

// For more Line Chart information:
// https://apexcharts.com/react-chart-demos/line-charts/basic/

// A chart that shows the average waiting time for cars going from north to south
const MovingAvgChart = (values: any): JSX.Element => {
  
  const data1 = Array();
  const data2 = Array();
  const data3 = Array();

  for(let i=0; i < values.values[0].time.length; i++){
    data1.push({[values.values[0].time[i]]: values.values[0].count[i]});
  };

  for(let i=0; i< values.values[1].time.length; i++){
    data2.push({[values.values[1].time[i]]: values.values[1].count[i]});
  };
  for(let i=0; i<values.values[2].time.length; i++){
    data3.push({[values.values[2].time[i]]: values.values[2].count[i]});
  }; 

  console.log(data1);

  //console.log(data1);
  
  const state = {
    options: {
      chart: {
        background: '#FFF',
        zoom: {
          enabled: false,
        },
      },
      dataLabels: {
        enabled: true,
      },
      title: {
        text: 'Moving Average',
        align: 'center',
      },
      grid: {
        row: {
          colors: ['#f3f3f3', 'transparent'],
          opacity: 0.5,
        },
      },
      xaxis: {
        categories: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23],
        title: {
          text: 'Hours of the Day',
        },
      },
      yaxis: {
        title: {
          text: 'Car Count',
        },
      },
      colors: ['#04a777'],
      
    },
    series: [
      {
        name: 'Number Of Cars',
        data: [
          [1,0],[22,4]
        ],
      },
    ],
  };
  return <Chart options={state.options} series={state.series} type="line" />;
};

export default MovingAvgChart;

/* eslint-disable no-console */
/* eslint-disable  @typescript-eslint/camelcase */
import React from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import { Response as countData, fetchCount } from '../../api/fetchCount';
import { SKEYE_WHITE, SKEYE_BLACK } from '../../css/custom';

// Realtime graph from the ApexCharts Documentation Website
// https://apexcharts.com/react-chart-demos/line-charts/realtime/
// https://github.com/apexcharts/apexcharts.js/blob/master/samples/react/line/realtime.html
// Logic to be implemented:
// Check the current time, if the minutes are equal to 00,
// then retrieve the new data for the current hour.
// Check if the values in the graph are populated or not
async function loadArima(predictionData: countData[]): Promise<countData[]> {
  const current_arima: any[] = [];
  try {
    /* eslint-disable no-plusplus */
    // Populate the entire arima dataset if count is equal to zero
    for (let i = 0; i < predictionData.length; i++) {
      current_arima.push(predictionData[i].count);
      current_arima.push(predictionData[i].count);
      current_arima.push(predictionData[i].count);
      current_arima.push(predictionData[i].count);
    }
  } catch (error) {
    console.log(error);
  }
  return current_arima;
}

async function loadMovingAverage(
  prev_current_mavg: countData[],
  movingAverageData: any,
  COUNT: number,
): Promise<countData[]> {
  const date = new Date();
  const current_mavg = prev_current_mavg;
  try {
    // Populate the moving average displayed on graph one by one
    if (COUNT < date.getHours()) {
      // populate the line chart
      if (COUNT === 0) {
        current_mavg.push(movingAverageData[COUNT].count);
        current_mavg.push(movingAverageData[COUNT + 1].count);
        current_mavg.push(movingAverageData[COUNT + 2].count);
        current_mavg.push(movingAverageData[COUNT + 3].count);
      } else {
        current_mavg.push(movingAverageData[COUNT * 4 - 4].count);
        current_mavg.push(movingAverageData[COUNT * 4 - 3].count);
        current_mavg.push(movingAverageData[COUNT * 4 - 2].count);
        current_mavg.push(movingAverageData[COUNT * 4 - 1].count);
      }
    }
  } catch (error) {
    console.log(error);
    console.log(`COUNT AT: ${COUNT}`);
  }
  return current_mavg;
}

interface Props {
  chartID: string;
  title: string;
  countDirection: string;
}

// For every graph, there needs to be options and series
// Options represents the type of chart with all its options
// Series represents the given data to the graph
interface ChartState {
  lineOptions: any;
  lineSeries: any;
}

class RealTimeLine extends React.Component<{} & Props, ChartState> {
  constructor(props: any) {
    super(props);
    const { chartID, title } = this.props;
    this.state = {
      lineOptions: {
        chart: {
          id: chartID,
          height: 350,
          type: 'line',
          background: SKEYE_BLACK,
          animations: {
            enabled: true,
            easing: 'linear',
            dynamicAnimation: {
              speed: 1000,
            },
          },
          toolbar: {
            show: false,
          },
          zoom: {
            enabled: false,
          },
        },
        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: 'smooth',
        },
        title: {
          align: 'center',
          text: title,
          style: {
            color: SKEYE_WHITE,
          },
        },
        markers: {
          size: 0,
        },
        xaxis: {
          min: 0,
          max: 95,
          range: 95,
          title: {
            text: 'Hours',
            align: 'center',
            style: {
              color: SKEYE_WHITE,
            },
          },
          labels: {
            formatter(max: number): string {
              if (max % 4 === 0) {
                return String(`${max / 4}:00`);
              }
              return '';
            },
            style: {
              colors: SKEYE_WHITE,
            },
          },
        },
        yaxis: {
          min: 0,
          max: 200,
          title: {
            text: 'Cars',
            style: {
              color: SKEYE_WHITE,
            },
          },
          labels: {
            style: {
              colors: SKEYE_WHITE,
            },
          },
        },
        legend: {
          show: true,
        },
      },
      lineSeries: [
        {
          name: 'Prediction',
          data: [],
        },
        {
          name: 'Moving Average',
          data: [],
        },
      ],
    };
  }

  // The data gets retrieved here, in future implementations: Use async fetch from the database
  public async componentDidMount(): Promise<void> {
    const { chartID, countDirection } = this.props;
    // const date = new Date().toISOString().split('T')[0];
    const time = new Date();
    const date = '2020-01-31';
    const arimaData = await fetchCount('arima', countDirection, date);
    const movingAverageData = await fetchCount('MA', countDirection, date);
    let current_arima: countData[] = [];
    let current_mavg: countData[] = [];

    let COUNT = 0;
    window.setInterval(async (): Promise<any> => {
      // Data gets populated here
      // Datasets current_arima and current_mavg get updated here
      current_arima = await loadArima(arimaData);
      current_mavg = await loadMovingAverage(current_mavg, movingAverageData, COUNT);
      // Execute the realtime function here, using the two below data arrays as datasets
      // ApexCharts.exec() takes in chart ID, method, and data as parameters
      /* eslint-disable no-undef */
      ApexCharts.exec(chartID, 'updateSeries', [{ data: current_arima }, { data: current_mavg }]);
      // console.log(chartID);
      // console.log(current_arima);
      // console.log(current_mavg);
      COUNT++;
    }, 1000 / time.getHours());
  }

  /* eslint-disable react/destructuring-assignment */
  public render(): JSX.Element {
    return (
      <div>
        <Chart type="line" series={this.state.lineSeries} options={this.state.lineOptions} />
      </div>
    );
  }
}

export default RealTimeLine;

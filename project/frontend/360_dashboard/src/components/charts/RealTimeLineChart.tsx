/* eslint-disable  @typescript-eslint/camelcase */
import React from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import { Response as countData, fetchCount } from '../../api/fetchCount';

// Realtime graph from the ApexCharts Documentation Website
// https://apexcharts.com/react-chart-demos/line-charts/realtime/
// https://github.com/apexcharts/apexcharts.js/blob/master/samples/react/line/realtime.html

const current_mavg: any[] = [];
const current_arima: any[] = [];
let COUNT = 0;

// Logic to be implemented:
// Check the current time, if the minutes are equal to 00,
// then retrieve the new data for the current hour.
// Check if the values in the graph are populated or not
async function loadDataToChart(
  predictionData: countData[],
  movingAverageData: countData[],
): Promise<void> {
  const date = new Date();
  /* eslint-disable no-plusplus */
  // Populate the entire arima dataset if count is equal to zero
  if (COUNT === 0) {
    for (let i = 0; i < predictionData.length; i++) {
      current_arima.push(predictionData[i].count);
    }
  }
  // Populate the moving average displayed on graph one by one
  if (COUNT <= date.getHours()) {
    // populate the line chart
    current_mavg.push(movingAverageData[COUNT].count);
  }
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
        },
        markers: {
          size: 0,
        },
        xaxis: {
          range: 23,
          title: {
            text: 'Hours',
            align: 'center',
          },
        },
        yaxis: {
          min: 0,
          max: 200,
          title: {
            text: 'Cars',
          },
        },
        legend: {
          show: true,
        },
      },
      lineSeries: [
        {
          name: 'Prediction',
          data: current_arima,
        },
        {
          name: 'Moving Average',
          data: current_mavg,
        },
      ],
    };
  }

  // The data gets retrieved here, in future implementations: Use async fetch from the database
  public async componentDidMount(): Promise<void> {
    const { chartID, countDirection } = this.props;
    // const date = new Date().toISOString().split('T')[0];
    const mockDate = '2020-01-31';
    const arimaData = await fetchCount('arima', countDirection, mockDate);
    const movingAverageData = await fetchCount('MA', countDirection, mockDate);
    window.setInterval((): any => {
      // Data gets populated here
      // Datasets current_arima and current_mavg get updated here
      loadDataToChart(arimaData, movingAverageData);

      // Execute the realtime function here, using the two below data arrays as datasets
      // ApexCharts.exec() takes in chart ID, method, and data as parameters
      /* eslint-disable no-undef */
      ApexCharts.exec(chartID, 'updateSeries', [{ data: current_arima }, { data: current_mavg }]);
      COUNT++;
    }, 1000);
  }

  /* eslint-disable react/destructuring-assignment */
  public render(): JSX.Element {
    return (
      <div>
        <Chart options={this.state.lineOptions} series={this.state.lineSeries} type="line" />
      </div>
    );
  }
}

export default RealTimeLine;

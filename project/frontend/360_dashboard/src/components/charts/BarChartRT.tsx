/* eslint-disable no-console */
import React from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import { Response as countData, fetchCount } from '../../api/fetchCount';
import { SKEYE_BLACK, SKEYE_WHITE } from '../../css/custom';

// Realtime graph from the ApexCharts Documentation Website
// https://apexcharts.com/react-chart-demos/line-charts/realtime/
// https://github.com/apexcharts/apexcharts.js/blob/master/samples/react/line/realtime.html

// Logic to be implemented:
// Check the current time, if the minutes are equal to 00,
// then retrieve the new data for the current hour.
// Check if the values in the graph are populated or not
async function loadDataToChart(
  primaryDirection: any,
  secondaryMovingAverageData: any,
  prev_current_mavg: countData[],
): Promise<any> {
  const date = new Date();
  let current_bar = prev_current_mavg;
  try {
    // Populate the moving average displayed on graph one by one
    current_bar = [];
    // populate the bar chart
    current_bar.push(primaryDirection[date.getHours() * 4 - 1].count);
    current_bar.push(secondaryMovingAverageData[date.getHours() * 4 - 1].count);
  } catch (error) {
    console.log(error);
  }
  return current_bar;
}

// Component external parameters
interface Props {
  chartID: string;
  title: string;
  categories: [string, string];
  primaryDirection: string;
  secondaryDirection: string;
}

// For every graph, there needs to be options and series
// Options represents the type of chart with all its options
// Series represents the given data to the graph
interface ChartState {
  barOptions: any;
  barSeries: any;
}

class BarChartRT extends React.Component<{} & Props, ChartState> {
  constructor(props: any) {
    super(props);
    const { chartID, title, categories } = this.props;
    this.state = {
      barOptions: {
        chart: {
          id: chartID,
          type: 'bar',
          height: 350,
          background: SKEYE_BLACK,
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        title: {
          align: 'center',
          text: title,
          style: {
            color: SKEYE_WHITE,
          },
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories,
          labels: {
            style: {
              colors: SKEYE_WHITE,
            },
          },
        },
        yaxis: {
          min: 0,
          max: 200,
          labels: {
            style: {
              colors: SKEYE_WHITE,
            },
          },
        },
      },
      barSeries: [
        {
          data: [],
        },
      ],
    };
  }

  // The data gets retrieved here, in future implementations: Use async fetch from the database
  public async componentDidMount(): Promise<void> {
    const { chartID, primaryDirection, secondaryDirection } = this.props;
    // const date = new Date().toISOString().split('T')[0];
    const date = '2020-01-31';
    const primaryMovingAverageData = await fetchCount('MA', primaryDirection, date);
    const secondaryMovingAverageData = await fetchCount('MA', secondaryDirection, date);

    let current_bar: any[] = [];

    window.setInterval(async (): Promise<any> => {
      // Data gets populated here
      // Datasets current_arima and current_mavg get updated here
      // console.log(current_bar);
      console.log(primaryMovingAverageData);
      console.log(secondaryMovingAverageData);
      current_bar = await loadDataToChart(
        primaryMovingAverageData,
        secondaryMovingAverageData,
        current_bar,
      );

      // Execute the realtime function here, using the two below data arrays as datasets
      // ApexCharts.exec() takes in chart ID, method, and data as parameters
      ApexCharts.exec(chartID, 'updateSeries', [{ data: current_bar }]);
      // eslint-disable-next-line no-plusplus
    }, 1000);
  }

  /* eslint-disable react/destructuring-assignment */
  public render(): JSX.Element {
    return (
      <div>
        <Chart options={this.state.barOptions} series={this.state.barSeries} type="bar" />
      </div>
    );
  }
}
export default BarChartRT;

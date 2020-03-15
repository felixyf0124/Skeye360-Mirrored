/* eslint-disable  @typescript-eslint/camelcase */
import React from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import { Response as countData, fetchCount } from '../../api/fetchCount';

// Realtime graph from the ApexCharts Documentation Website
// https://apexcharts.com/react-chart-demos/line-charts/realtime/
// https://github.com/apexcharts/apexcharts.js/blob/master/samples/react/line/realtime.html

let current_bar: any[] = [];
let COUNT = 0;

// Logic to be implemented:
// Check the current time, if the minutes are equal to 00,
// then retrieve the new data for the current hour.
// Check if the values in the graph are populated or not
async function loadDataToChart(
  primaryDirection: countData[],
  secondaryMovingAverageData: countData[],
): Promise<void> {
  const date = new Date();
  // Populate the moving average displayed on graph one by one
  if (COUNT <= date.getHours()) {
    current_bar = [];
    // populate the bar chart
    current_bar.push(primaryDirection[COUNT].count);
    current_bar.push(secondaryMovingAverageData[COUNT].count);
  }
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
        },
        plotOptions: {
          bar: {
            horizontal: true,
          },
        },
        title: {
          align: 'center',
          text: title,
        },
        dataLabels: {
          enabled: false,
        },
        xaxis: {
          categories,
        },
        yaxis: {
          min: 0,
          max: 200,
        },
      },
      barSeries: [
        {
          data: current_bar[0],
        },
      ],
    };
  }

  // The data gets retrieved here, in future implementations: Use async fetch from the database
  public async componentDidMount(): Promise<void> {
    const { chartID, primaryDirection, secondaryDirection } = this.props;
    // const date = new Date().toISOString().split('T')[0];
    const mockDate = '2020-01-31';
    const primaryMovingAverageData = await fetchCount('MA', primaryDirection, mockDate);
    const secondaryMovingAverageData = await fetchCount('MA', secondaryDirection, mockDate);
    window.setInterval((): any => {
      // Data gets populated here
      // Datasets current_arima and current_mavg get updated here
      loadDataToChart(primaryMovingAverageData, secondaryMovingAverageData);

      // Execute the realtime function here, using the two below data arrays as datasets
      // ApexCharts.exec() takes in chart ID, method, and data as parameters
      ApexCharts.exec(chartID, 'updateSeries', [{ data: current_bar }]);
      // eslint-disable-next-line no-plusplus
      COUNT++;
    }, 50);
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

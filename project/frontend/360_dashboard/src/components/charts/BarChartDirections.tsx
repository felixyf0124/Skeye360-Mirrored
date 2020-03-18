/* eslint-disable no-console */
/* eslint-disable  @typescript-eslint/camelcase */
import React from 'react';
import Chart from 'react-apexcharts';
import ApexCharts from 'apexcharts';
import { SKEYE_BLACK, SKEYE_WHITE } from '../../css/custom';

// Realtime graph from the ApexCharts Documentation Website
// https://apexcharts.com/react-chart-demos/line-charts/realtime/
// https://github.com/apexcharts/apexcharts.js/blob/master/samples/react/line/realtime.html

// Component external parameters
interface Props {
  chartID: string;
  title: string;
  categories: string[];
  directionData: Array<{ direction: string, passedNum: number }>;
}

// For every graph, there needs to be options and series
// Options represents the type of chart with all its options
// Series represents the given data to the graph
interface ChartState {
  barOptions: any;
  barSeries: any;
}

async function loadDataToChart(
  data: number[],
): Promise<any> {
  const date = new Date();
  let current_bar;
  try {
    // Populate the moving average displayed on graph one by one
    current_bar = [];
    // populate the bar chart
    current_bar.push(data[0]);
    current_bar.push(data[1]);
    current_bar.push(data[2]);
    current_bar.push(data[3]);
  } catch (error) {
    console.log(error);
  }
  return current_bar;
}

class BarChartDirections extends React.Component<{} & Props, ChartState> {
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
    const { chartID, directionData } = this.props;
    let data;
    data = await loadDataToChart([
      directionData[0].passedNum,
      directionData[1].passedNum,
      directionData[2].passedNum,
      directionData[3].passedNum,
    ]);
    ApexCharts.exec(chartID, 'updateSeries', [{ data: data }]); //[{ data: current_bar }]);
  }

  public async componentDidUpdate(): Promise<void> {

    const { chartID, directionData } = this.props;
    let data;
    data = await loadDataToChart([
      directionData[0].passedNum,
      directionData[1].passedNum,
      directionData[2].passedNum,
      directionData[3].passedNum,
    ]);
    ApexCharts.exec(chartID, 'updateSeries', [{ data: data }]); //[{ data: current_bar }]);
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
export default BarChartDirections;

import React from 'react';
import { connect } from 'react-redux';
import BarChart from './BarChart';
import PieChart from './PieChart';
import LineChart from './LineChart';
import MixedChart from './MixedChart';
import Header from './Header';
import NorthChartComparison from './NorthChartComparison';
import AvgWaitTimeChartComparison from './AvgWaitTimeChartComparison';

const ChartsPrototype = (): JSX.Element => (
  <div>
    <Header />
    <div className="charts-prototype">
      <h1 className="charts-header">Chart Prototypes</h1>
      <div className="charts-row">
        <NorthChartComparison />
        <AvgWaitTimeChartComparison />
      </div>
      <div className="charts-row">
        <LineChart />
        <MixedChart />
      </div>
      <div className="charts-row">
        <PieChart />
        <BarChart />
      </div>
    </div>
  </div>
);

export default connect()(ChartsPrototype);

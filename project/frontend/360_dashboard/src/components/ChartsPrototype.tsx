import React from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import BarChart from './BarChart';
import PieChart from './PieChart';
import LineChart from './LineChart';
import MixedChart from './MixedChart';
import Header from './Header';
import { RootState } from '../reducers/rootReducer';


interface Props {
    authenticated: boolean;
}

const ChartsPrototype = ({ authenticated }: Props): JSX.Element => {
  if (!authenticated) return <Redirect push to="/login" />;

  return (
    <div>
      <Header />
      <div className="charts-prototype">
        <h1 className="charts-header">Chart Prototypes</h1>
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
};

const mapStateToProps = (state: RootState): Props => ({
  authenticated: state.authentication.authenticated,
});


export default connect(
  mapStateToProps,
)(ChartsPrototype);

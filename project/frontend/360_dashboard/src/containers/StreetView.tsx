import React from 'react';
import { connect } from 'react-redux';
import { Redirect, Link } from 'react-router-dom';
import { RootState } from '../reducers/rootReducer';
import Header, { Head } from '../components/Header';
import Simulator from './simulator/Scene';
import NorthChart from '../components/NorthChart';
import AvgWaitTimeChart from '../components/AvgWaitTimeChart';

interface Props {
  authenticated: boolean;
}

const StreetView = ({ authenticated }: Props): JSX.Element => {
  if (!authenticated) return <Redirect push to="/login" />;

  return (
    <div>
      <Header />
      <Head>
        <Link to="/streetview/edit" className="header-text">Edit</Link>
      </Head>
      <Simulator />
      <div className="charts-row">
        <NorthChart />
        <AvgWaitTimeChart />
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState): Props => ({
  authenticated: state.authentication.authenticated,
});

export default connect(
  mapStateToProps,
)(StreetView);

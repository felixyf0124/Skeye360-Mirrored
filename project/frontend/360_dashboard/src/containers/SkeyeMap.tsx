import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RootState } from '../reducers/rootReducer';
import GoogleMap from '../components/GoogleMap';
// import Simulator from '../containers/simulator/Scene';
import Header from '../components/Header';

interface Props {
  authenticated: boolean;
}

const SkeyeMap = ({ authenticated }: Props): JSX.Element => {
  if (!authenticated) return <Redirect push to="/login" />;

  return (
    <div>
      <Header />
      <GoogleMap />
    </div>
  );
};

const mapStateToProps = (state: RootState): Props => ({
  authenticated: state.authentication.authenticated,
});

export default connect(
  mapStateToProps,
)(SkeyeMap);

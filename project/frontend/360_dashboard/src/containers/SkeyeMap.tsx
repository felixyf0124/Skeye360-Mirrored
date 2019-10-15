import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import GoogleMap from '../components/GoogleMap';
import Simulator from './simulator/Scene';

interface Props {
  streaming_map: boolean;
}

const SkeyeMap = ({ streaming_map, }: Props):JSX.Element => (
  <div>
    {!streaming_map ? (
      <GoogleMap />
    ) : (
      <Simulator />
    )}
  </div>
);

const mapStateToProps = (state: RootState): Props => ({
  streaming_map: state.streetview.streaming_map,
});

export default connect(
  mapStateToProps,
)(SkeyeMap);
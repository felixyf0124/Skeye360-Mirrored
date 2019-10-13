import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import GoogleMap from '../components/GoogleMap';

interface Props {
  hello: string;
}

function SkeyeMap({ hello, }: Props) {
  return(
    <GoogleMap />
  );
}

const mapStateToProps = (state: RootState): Props => ({
  hello: "",
});

export default connect(
  mapStateToProps,
)(SkeyeMap);
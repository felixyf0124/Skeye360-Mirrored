/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../reducers/rootReducer';
import { getCurrentCount, GetCountAction } from '../contexts/vehicleCounts';

const TrafficIntensityContainer = styled.div``;

interface Props {
  intersection_id: number;
}

interface StateProps {
  los: number;
}

interface DispatchProps {
  getCurrentCount: (cameraUrl: string) => GetCountAction;
}

const TrafficIntensity = (props: Props & StateProps & DispatchProps): JSX.Element => {
  const { los } = props;
  const displayIntensity = (): string => {
    if (los === -1) {
      return 'Loading...';
    }
    if (los <= 20) {
      return 'Low';
    }
    if (los > 55) {
      return 'High';
    }
    return 'Medium';
  };
  return <TrafficIntensityContainer>{displayIntensity()}</TrafficIntensityContainer>;
};

const mapStateToProps = (state: RootState): StateProps => ({
  ...state,
  los: state.count.los,
});

const mapDispatchToProps: DispatchProps = {
  getCurrentCount,
};

export default connect(mapStateToProps, mapDispatchToProps)(TrafficIntensity);

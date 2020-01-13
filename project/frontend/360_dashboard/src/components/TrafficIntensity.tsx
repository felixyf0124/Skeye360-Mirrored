/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../reducers/rootReducer';
import { logClick, LogAction } from '../contexts/LogClicks';

const TrafficIntensityContainer = styled.div``;

interface Props {
  intersection_id: number;
}

interface StateProps {
  traffic: number;
}

interface DispatchProps {
  logClick: (log_message: string, user_id: number) => LogAction;
}

const TrafficIntensity = (props: Props & StateProps & DispatchProps): JSX.Element => {
  const { intersection_id, traffic } = props;
  const displayIntensity = (): string => {
    if (traffic <= 20) {
      return 'Low';
    }
    if (traffic > 55) {
      return 'High';
    }
    return 'Medium';
  };
  return <TrafficIntensityContainer>{displayIntensity()}</TrafficIntensityContainer>;
};

const mapStateToProps = (state: RootState): StateProps => ({
  ...state,
  traffic: 0,
});

const mapDispatchToProps: DispatchProps = {
  logClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(TrafficIntensity);

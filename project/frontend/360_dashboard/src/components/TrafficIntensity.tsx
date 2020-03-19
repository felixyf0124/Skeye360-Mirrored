/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../reducers/rootReducer';
import { STATE as trafficState, getTraffic, GetTrafficAction } from '../contexts/traffic';
import {
  SKEYE_GREY, SKEYE_RED, SKEYE_YELLOW, SKEYE_BRIGHT_GREEN,
} from '../css/custom';

const OfflineIndicator = styled.h6`
  color: ${SKEYE_GREY};
`;

const RedIndicator = styled.h6`
  color: ${SKEYE_RED};
`;

const YellowIndicator = styled.h6`
  color: ${SKEYE_YELLOW};
`;

const GreenIndicator = styled.h6`
  color: ${SKEYE_BRIGHT_GREEN};
`;

interface Props {
  camera_id: number;
  camera_url: string;
}

interface StateProps {
  traffic: trafficState;
}

interface DispatchProps {
  getTraffic(cameraID: number, cameraIP: string): GetTrafficAction;
}

// Traffic Intensity Metric
class TrafficIntensity extends React.Component<{} & Props & StateProps & DispatchProps> {
  // Fetches LOS from the camera server for traffic intensity measurements.
  componentDidMount(): void {
    const { camera_id, camera_url, getTraffic } = this.props;
    getTraffic(camera_id, camera_url);
  }

  // componentDidUpdate(prevState: StateProps): void {
  //   const { traffic: prevTraffic } = prevState;
  //   const {
  //     traffic, camera_id, camera_url, getTraffic,
  //   } = this.props;
  //   if (prevTraffic[camera_id].los !== traffic[camera_id].los) {
  //     getTraffic(camera_id, camera_url);
  //   }
  // }

  // Render Traffic Intensity Metric
  render(): JSX.Element {
    const { camera_id, traffic } = this.props;
    const displayIntensity = (): any => {
      if (traffic[camera_id] === undefined) {
        return <OfflineIndicator>N/A</OfflineIndicator>;
      }
      if (traffic[camera_id].los === -1) {
        return <OfflineIndicator>N/A</OfflineIndicator>;
      }
      if (traffic[camera_id].los <= 20) {
        return <GreenIndicator>Low</GreenIndicator>;
      }
      if (traffic[camera_id].los > 55) {
        return <RedIndicator>High</RedIndicator>;
      }
      return <YellowIndicator>Medium</YellowIndicator>;
    };
    return <div>{displayIntensity()}</div>;
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  traffic: state.traffic,
});

const mapDispatchToProps: DispatchProps = {
  getTraffic,
};

export default connect(mapStateToProps, mapDispatchToProps)(TrafficIntensity);

/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { STATE as trafficState, getTraffic, GetTrafficAction } from '../contexts/traffic';

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

  componentDidUpdate(prevState: StateProps): void {
    const { traffic: prevTraffic } = prevState;
    const {
      traffic, camera_id, camera_url, getTraffic,
    } = this.props;
    if (prevTraffic[camera_id] !== traffic[camera_id]) {
      getTraffic(camera_id, camera_url);
    }
  }

  // Render Traffic Intensity Metric
  render(): JSX.Element {
    const { camera_id, traffic } = this.props;
    const displayIntensity = (): any => {
      if (traffic[camera_id] === undefined) {
        return 'N/A';
      }
      if (traffic[camera_id].los === -1) {
        return 'N/A';
      }
      if (traffic[camera_id].los <= 20) {
        return 'Low';
      }
      if (traffic[camera_id].los > 55) {
        return 'High';
      }
      return 'Medium';
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

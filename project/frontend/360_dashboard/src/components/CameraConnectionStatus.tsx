/* eslint-disable react/prefer-stateless-function */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import { green } from '@material-ui/core/colors';
import { RootState } from '../reducers/rootReducer';
import { STATE as trafficState } from '../contexts/traffic';

interface Props {
  camera_id: number;
}

interface StateProps {
  traffic: trafficState;
}

// Camera Server Status
class CameraConnectionStatus extends React.Component<{} & Props & StateProps> {
  // Render Traffic Intensity Metric
  render(): JSX.Element {
    const { traffic, camera_id } = this.props;
    const displayStatus = (): any => {
      if (traffic[camera_id] === undefined) {
        return <FiberManualRecordIcon color="secondary" />;
      }
      if (traffic[camera_id].los === -1) {
        return <FiberManualRecordIcon color="secondary" />;
      }
      return <FiberManualRecordIcon style={{ color: green[500] }} />;
    };
    return <div>{displayStatus()}</div>;
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  traffic: state.traffic,
});

export default connect(mapStateToProps, {})(CameraConnectionStatus);

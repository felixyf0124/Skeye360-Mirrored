/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core/';

const Body = styled.div``;

interface Props {
  camera_url: string;
}

interface StateProps {
  error: string;
  isLoaded: boolean;
}

// Camera Server Status
class CameraConnectionStatus extends React.Component<{} & Props, StateProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: '',
      isLoaded: false,
    };
  }

  // Fetches online status from the camera server for the server status.
  componentDidMount(): void {
    const { camera_url } = this.props;
    // Using a random end point just to see if the connection is established.
    const API_URL = `http://${camera_url}/los/`;
    // eslint-disable-next-line no-shadow
    fetch(API_URL)
      .then((results) => results.json())
      .then(
        (data: any) => {
          this.setState({
            isLoaded: true,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        },
      );
  }

  // Render the camera server status.
  render(): JSX.Element {
    const { error, isLoaded } = this.state;

    const displayServerStatus = (): any => {
      if (error) {
        // return `${error}`;
        return 'Offline';
      }
      if (!isLoaded) {
        return <CircularProgress />;
      }
      return 'Online';
    };
    return <Body>{displayServerStatus()}</Body>;
  }
}

export default CameraConnectionStatus;

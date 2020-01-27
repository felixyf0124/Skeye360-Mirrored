/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core/';

const TrafficIntensityContainer = styled.div``;

interface Props {
  camera_url: string;
}

interface StateProps {
  error: string;
  los: number;
  isLoaded: boolean;
}

interface IntensityState {
  los: number;
}

// Traffic Intensity Metric
class TrafficIntensity extends React.Component<{} & Props, StateProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: '',
      isLoaded: false,
      los: -1,
    };
  }

  // Fetches LOS from the camera server for traffic intensity measurements.
  componentDidMount(): void {
    const { camera_url } = this.props;
    const API_URL = `http://${camera_url}/los/`;
    // eslint-disable-next-line no-shadow
    fetch(API_URL)
      .then((results) => results.json())
      .then(
        (data: IntensityState) => {
          this.setState({
            isLoaded: true,
            los: data.los,
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

  // Render Traffic Intensity Metric
  render(): JSX.Element {
    const { error, isLoaded, los } = this.state;

    const displayIntensity = (): any => {
      if (error) {
        // return `${error}`;
        return 'N/A';
      }
      if (!isLoaded || los === -1) {
        return <CircularProgress />;
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
  }
}

export default TrafficIntensity;

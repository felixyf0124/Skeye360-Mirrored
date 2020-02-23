import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { SKEYE_WHITE } from '../../css/custom';
import NorthChart from '../NorthChart';
import SouthChart from '../SouthChart';
import GoogleMiniMap from '../GoogleMiniMap';
import PieChart from '../PieChart';
import DisplayCount from '../DisplayMovAVG';
import { RootState } from '../../reducers/rootReducer';
import {
  STATE as intersectionState,
  getExistingIntersection,
  resetIntersection as resetCurrentIntersection,
  ResetIntersectionAction,
} from '../../contexts/intersection';
import {
  STATE as cameraState,
  getExistingCamera,
} from '../../contexts/camera';

const Body = styled.div`
  margin-left: 5rem;
  margin-top: 2rem;
`;

const MapContainer = styled.div`
  position: relative;
  height: 30vh;
  width: 90vw;
  margin: 1rem;
`;

const AverageMetricChartsContainer = styled.div`
  background-color: ${SKEYE_WHITE};
  height: 13vh;
  width: 20vw;
  position: relative;
  margin: 1rem;
  vertical-align: middle;
  text-align: center;
`;

// Smaller charts for the bottom left side charts.
const SmallChartContainer = styled.div`
  background-color: ${SKEYE_WHITE};
  width: 30vw;
  position: relative;
  margin: 1rem;
`;

// Bigger chart on the bottom right side chart.
const BigChartContainer = styled.div`
  background-color: ${SKEYE_WHITE};
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  align-content: center;
  width: 70vw;
  margin: 1rem;
`;

// Generic flexboxes styling
const ChartVerticalFlexBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: stretch;
  align-content: stretch;
`;

const ChartHorizontalFlexBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: stretch;
  align-content: stretch;
  }
`;

const skeyeStyles = {
  Title: {
    color: SKEYE_WHITE,
    fontSize: 28,
    marginBottom: 4,
    fontWeight: 900,
  },
  Header: {
    color: SKEYE_WHITE,
    fontSize: 20,
    marginBottom: 4,
    fontWeight: 900,
  },
};

// state & props
interface StateProps {
  intersection: intersectionState;
  camera: cameraState;
  intersectionId: string;
  intersectionName: string;
  intersectionLat: string;
  intersectionLng: string;
  cameraId: string;
  error: string;
  user_id: number;
}

interface DispatchProps {
  getExistingIntersection: (id: string) => any;
  getExistingCamera: (id: string) => any;
  resetCurrentIntersection(): ResetIntersectionAction;
}

class DataAnalyticsComponent extends React.Component<StateProps & DispatchProps> {
  // component mount will fetch existing intersection
  public componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    const { intersectionId, getExistingIntersection } = this.props;
    getExistingIntersection('2');
    const { cameraId, getExistingCamera } = this.props;
    getExistingCamera(cameraId);
  }

  // component unmount resets the loaded data
  public componentWillUnmount(): void {
    // eslint-disable-next-line no-shadow
    const { resetCurrentIntersection } = this.props;
    resetCurrentIntersection();
  }

  public render(): JSX.Element {
    const {
      intersectionId, intersectionName, intersectionLat, intersectionLng, cameraId,
    } = this.props;

    console.log('-----------DATA--------------');
    console.log(`camera id:${cameraId}`);
    console.log(`Intersection id:${intersectionId}`);
    console.log(`Intersection name:${intersectionName}`);
    console.log(`intersection lat and long : ${intersectionLat} | ${intersectionLng}`);
    console.log('----------------------------------');

    return (
      <div>
        <text style={skeyeStyles.Title}>Data Analytics</text>
        <Body>
          <ChartHorizontalFlexBox>
            <MapContainer>
              {intersectionLat === '' ? (
                <p>Loading...</p>
              ) : (
                <GoogleMiniMap
                  intersectionId={intersectionId}
                  intersectionLat={intersectionLat}
                  intersectionLng={intersectionLng}
                />
              )}
            </MapContainer>
          </ChartHorizontalFlexBox>
          <ChartHorizontalFlexBox>
            <ChartVerticalFlexBox>
              <SmallChartContainer>
                <NorthChart />
              </SmallChartContainer>
              <SmallChartContainer>
                <SouthChart />
              </SmallChartContainer>
            </ChartVerticalFlexBox>
            <BigChartContainer>
              <PieChart />
            </BigChartContainer>
          </ChartHorizontalFlexBox>
        </Body>
      </div>
    );
  }
}


// state mapping
const mapStateToProps = (state: RootState): StateProps => ({
  intersection: state.intersection,
  cameraId: state.router.location.pathname.substring(
    state.router.location.pathname.lastIndexOf('/') + 1,
  ),
  // cameraId: '2',
  camera: state.camera,
  intersectionId: state.camera.intersection_id.toString(),
  intersectionName: state.intersection.intersection_name,
  intersectionLat: state.intersection.latitude,
  intersectionLng: state.intersection.longitude,
  error: state.intersection.error,
  user_id: state.authentication.user_id,
});

// props dispatching
const mapDispatchToProps: DispatchProps = {
  getExistingIntersection,
  getExistingCamera,
  resetCurrentIntersection,
};

export default connect(mapStateToProps, mapDispatchToProps)(DataAnalyticsComponent);

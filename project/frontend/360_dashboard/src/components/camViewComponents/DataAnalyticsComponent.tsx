import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { SKEYE_WHITE } from '../../css/custom';
import NorthChart from '../NorthChart';
import SouthChart from '../SouthChart';
import GoogleMiniMap from '../GoogleMiniMap';
import NorthChartComparison from '../NorthChartComparison';
import { RootState } from '../../reducers/rootReducer';
import {
  STATE as intersectionState,
  getExistingIntersection,
  resetIntersection as resetCurrentIntersection,
  ResetIntersectionAction,
} from '../../contexts/intersection';
import { STATE as cameraState, getExistingCamera } from '../../contexts/camera';
import { getCamera } from '../../api/camera';

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
    const { cameraId } = this.props;
    this.getData(cameraId);
  }

  // component unmount resets the loaded data
  public componentWillUnmount(): void {
    // eslint-disable-next-line no-shadow
    const { resetCurrentIntersection } = this.props;
    resetCurrentIntersection();
  }

  async getData(cameraId: string): Promise<any> {
    getCamera(cameraId).then((data) => {
      const { getExistingIntersection } = this.props;
      getExistingIntersection(data.intersection_id.toString());
    });
  }

  public render(): JSX.Element {
    const { intersectionId, intersectionLat, intersectionLng } = this.props;

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
              <NorthChartComparison />
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

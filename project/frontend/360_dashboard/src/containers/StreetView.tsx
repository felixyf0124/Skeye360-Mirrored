/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../reducers/rootReducer';
import SideDrawer from '../components/SideDrawer';
import NorthChart from '../components/NorthChart';
import AvgWaitTimeChart from '../components/AvgWaitTimeChart';
import {
  STATE as intersectionState,
  getExistingIntersection,
  resetIntersection as resetCurrentIntersection,
  ResetIntersectionAction,
} from '../contexts/intersection';
import { logClick } from '../contexts/LogClicks';
import SouthChart from '../components/SouthChart';
import GoogleMiniMap from '../components/GoogleMiniMap';
import { SKEYE_WHITE } from '../css/custom';

// styled-component for map, chart and flexboxes
const Body = styled.div`
  margin-left: 5rem;
  margin-top: 5rem;
`;

const MapContainer = styled.div`
  position: relative;
  height: 20vh;
  width: 100vw;
  margin: 1rem;
`;

const SmallChartContainer = styled.div`
  background-color: ${SKEYE_WHITE};
  width: 30vw;
  position: relative;
  margin: 1rem;
`;

const BigChartContainer = styled.div`
  background-color: ${SKEYE_WHITE};
  position: relative;
  width: 70vw;
  margin: 1rem;
`;

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
`;

// state & props
interface StateProps {
  intersection: intersectionState;
  intersectionId: string;
  intersectionName: string;
  intersectionLat: string;
  intersectionLng: string;
  error: string;
  user_id: number;
}

interface DispatchProps {
  getExistingIntersection: (id: string) => any;
  resetCurrentIntersection(): ResetIntersectionAction;
  logClick: (log_message: string, user_id: number) => any;
}

// StreetView class
class StreetView extends React.Component<StateProps & DispatchProps> {
  // component mount will fetch existing intersection
  public componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    const { intersectionId, getExistingIntersection } = this.props;
    getExistingIntersection(intersectionId);
  }

  // component unmount resets the loaded data
  public componentWillUnmount(): void {
    // eslint-disable-next-line no-shadow
    const { resetCurrentIntersection } = this.props;
    resetCurrentIntersection();
  }

  public render(): JSX.Element {
    const {
      intersectionId, intersectionName, intersectionLat, intersectionLng,
    } = this.props;

    // components render
    return (
      <div>
        <SideDrawer headerTitle={intersectionName} />
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
              <AvgWaitTimeChart />
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
  intersectionId: state.router.location.pathname.substring(
    state.router.location.pathname.lastIndexOf('/') + 1,
  ),
  intersectionName: state.intersection.intersection_name,
  intersectionLat: state.intersection.latitude,
  intersectionLng: state.intersection.longitude,
  error: state.intersection.error,
  user_id: state.authentication.user_id,
});

// props dispatching
const mapDispatchToProps: DispatchProps = {
  getExistingIntersection,
  resetCurrentIntersection,
  logClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(StreetView);

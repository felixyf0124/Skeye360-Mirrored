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
import { SKEYE_WHITE, LOW_RES, MOBILE_DEVICE_MAX_WIDTH } from '../css/custom';
import DisplayCount from '../components/DisplayMovAVG';

// styled-component for map, chart and flexboxes
const Body = styled.div`
  margin-left: 5rem;
  margin-top: 5rem;
  @media only screen and (max-width: ${MOBILE_DEVICE_MAX_WIDTH}px) {
    & {
      margin-left: 3rem;
    }
  }
`;

const MapContainer = styled.div`
  position: relative;
  height: 30vh;
  width: 80vw;
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
  @media only screen and (max-width: ${LOW_RES}px) {
    & {
      width: 80vw;
    }
  }
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
  position: relative;
  width: 70vw;
  margin: 1rem;

  @media only screen and (max-width: ${LOW_RES}px) {
    & {
      width: 80vw;
    }
  }
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
  @media only screen and (max-width: ${LOW_RES}px) {
    & {
      justify-content: space-around;
      align-items: space-around;
      align-content: space-around;
      width: 80vw;
    }
  }
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
    if (window.innerWidth < LOW_RES) {
      return (
        <div>
          <SideDrawer headerTitle={intersectionName} />
          <Body>
            <ChartVerticalFlexBox>
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
              <AverageMetricChartsContainer>
                <h5>Average Cars</h5>
                <h3>N/A</h3>
              </AverageMetricChartsContainer>
              <AverageMetricChartsContainer>
                <h6>Average Gas Consumption</h6>
                <h5>N/A L/100km</h5>
              </AverageMetricChartsContainer>
              <BigChartContainer>
                <NorthChart />
              </BigChartContainer>
              <BigChartContainer>
                <SouthChart />
              </BigChartContainer>
              <BigChartContainer>
                <AvgWaitTimeChart />
              </BigChartContainer>
            </ChartVerticalFlexBox>
          </Body>
        </div>
      );
    }
    return (
      <div>
        <SideDrawer headerTitle={intersectionName} />
        <Body>
          <ChartHorizontalFlexBox>
            <ChartVerticalFlexBox>
              <AverageMetricChartsContainer>
                <h5>Average Cars</h5>
                <h3>N/A</h3>
              </AverageMetricChartsContainer>
              <AverageMetricChartsContainer>
                <h5>Average Gas Consumption</h5>
                <h3>N/A L/100km</h3>
              </AverageMetricChartsContainer>
            </ChartVerticalFlexBox>
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
              <DisplayCount />
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

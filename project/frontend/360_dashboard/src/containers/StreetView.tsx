/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { RootState } from '../reducers/rootReducer';
import Header, { Head } from '../components/Header';
import NorthChart from '../components/NorthChart';
import AvgWaitTimeChart from '../components/AvgWaitTimeChart';
import {
  STATE as intersectionState,
  getExistingIntersection,
  deleteExistingIntersection,
  resetIntersection as resetCurrentIntersection,
  ResetIntersectionAction,
} from '../contexts/intersection';
import { logClick } from '../contexts/LogClicks';
import SouthChart from '../components/SouthChart';
import GoogleMiniMap from '../components/GoogleMiniMap';
import { SKEYE_WHITE } from '../css/custom';

const MapContainer = styled.div`
  position: relative;
  height: 20vh;
  width: 80vw;
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
  width: 50vw;
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
  deleteExistingIntersection: (id: string) => any;
  getExistingIntersection: (id: string) => any;
  resetCurrentIntersection(): ResetIntersectionAction;
  logClick: (log_message: string, user_id: number) => any;
}

class StreetView extends React.Component<StateProps & DispatchProps> {
  public componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    const { intersectionId, getExistingIntersection } = this.props;
    getExistingIntersection(intersectionId);
  }

  public componentWillUnmount(): void {
    // eslint-disable-next-line no-shadow
    const { resetCurrentIntersection } = this.props;
    resetCurrentIntersection();
  }

  public render(): JSX.Element {
    const {
      intersectionId,
      intersectionName,
      intersectionLat,
      intersectionLng,
      user_id,
    } = this.props;

    // eslint-disable-next-line consistent-return
    const handleDelete = (id: string): any => {
      // eslint-disable-next-line no-shadow
      const { deleteExistingIntersection } = this.props;
      const { logClick } = this.props;
      deleteExistingIntersection(id);
      logClick('Deleted Intersection', user_id);
    };

    return (
      <div>
        <Header />
        <Head>
          <h1 className="header-text">{intersectionName}</h1>
          <Link to={`/intersection/edit/${intersectionId}`} className="header-text">
            Edit
          </Link>
          <Link to="/" onClick={(): any => handleDelete(intersectionId)} className="header-text">
            Delete
          </Link>
        </Head>
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
      </div>
    );
  }
}

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

const mapDispatchToProps: DispatchProps = {
  deleteExistingIntersection,
  getExistingIntersection,
  resetCurrentIntersection,
  logClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(StreetView);

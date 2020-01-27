/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import SideDrawer from '../components/SideDrawer';
import IntersectionTable from '../components/IntersectionTable';
import { RootState } from '../reducers/rootReducer';
import {
  STATE as districtState,
  GetDistrictsAction,
  getDistricts,
  resetIntersection,
  ResetDistrictAction,
} from '../contexts/districts';
import { deleteExistingIntersection, DeleteIntersectionAction } from '../contexts/intersection';
import { logClick, LogAction } from '../contexts/LogClicks';
import TrafficNews from '../components/TrafficNews';
import { LOW_RES, MOBILE_DEVICE_MAX_WIDTH } from '../css/custom';

// Generic flexboxes styling
const ContentFlexBox = styled.div`
  margin-left: 5rem;
  margin-right: 0rem;
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: space-around;
  align-content: stretch;

  @media only screen and (max-width: ${LOW_RES}px) {
    & {
      flex-direction: column;
      overflow-x: hidden;
    }
  }
  @media only screen and (max-width: ${MOBILE_DEVICE_MAX_WIDTH}px) {
    & {
      margin-left: 2.5rem;
    }
  }
`;

const TableDiv = styled.div`
  @media only screen and (max-width: ${LOW_RES}px) {
    & {
      width: 90vw;
    }
  }
`;

const TrafficDiv = styled.div`
  @media only screen and (max-width: ${LOW_RES}px) {
    & {
      width: 93vw;
    }
  }
  @media only screen and (max-width: ${MOBILE_DEVICE_MAX_WIDTH}px) {
    & {
      width: 100vw;
    }
  }
`;

const title = 'Montreal';
interface StateProps {
  user_id: number;
  districts: districtState;
}

interface DispatchProps {
  getDistricts(): GetDistrictsAction;
  resetIntersection(): ResetDistrictAction;
  deleteExistingIntersection: (id: string) => DeleteIntersectionAction;
  logClick: (log_message: string, user_id: number) => LogAction;
}

class IntersectionList extends React.Component<(StateProps & DispatchProps) | any> {
  public componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    const { getDistricts } = this.props;
    getDistricts();
  }

  public componentDidUpdate(): void {
    // eslint-disable-next-line no-shadow
    const { getDistricts } = this.props;
    getDistricts();
  }

  public componentWillUnmount(): void {
    // eslint-disable-next-line no-shadow
    const { resetIntersection } = this.props;
    resetIntersection();
  }

  public render(): JSX.Element {
    const { districts } = this.props;
    // const districtsProps = {
    //   // eslint-disable-next-line object-shorthand
    //   districts: districts,
    // };
    return (
      <div>
        <SideDrawer headerTitle={title} />
        <ContentFlexBox>
          <TableDiv>
            {districts[0] === undefined ? <div /> : <IntersectionTable districts={districts} />}
          </TableDiv>
          <TrafficDiv>
            <TrafficNews />
          </TrafficDiv>
        </ContentFlexBox>
      </div>
    );
  }
}
const mapStateToProps = (state: RootState): StateProps => ({
  user_id: state.authentication.user_id,
  districts: state.districts,
});

const mapDispatchToProps: DispatchProps = {
  getDistricts,
  resetIntersection,
  deleteExistingIntersection,
  logClick,
};
export default connect(mapStateToProps, mapDispatchToProps)(IntersectionList);

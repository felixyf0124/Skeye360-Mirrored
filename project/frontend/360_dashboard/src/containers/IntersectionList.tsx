/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import SideDrawer from '../components/SideDrawer';
import IntersectionTable from '../components/IntersectionTable';
import { RootState } from '../reducers/rootReducer';
import { isStaff } from '../contexts/authentication';
import {
  STATE as districtState,
  GetDistrictsAction,
  getDistricts,
  resetDistricts,
  ResetDistrictAction,
} from '../contexts/districts';
import { deleteExistingIntersection, DeleteIntersectionAction } from '../contexts/intersection';
import { logClick, LogAction } from '../contexts/LogClicks';
import TrafficNews from '../components/TrafficNews';
import { LOW_RES, MOBILE_DEVICE_MAX_WIDTH } from '../css/custom';
import AddIntersection from './AddIntersection';
import { getUsers, STATE as userState, GetUsersAction } from '../contexts/users';

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

const AddButton = styled.div`
  float: right;
`;

const title = 'Montreal';
interface StateProps {
  districts: districtState;
  isStaff: boolean;
  users: userState;
  user_id: number;
}

interface DispatchProps {
  deleteExistingIntersection: (id: string) => DeleteIntersectionAction;
  getDistricts(): GetDistrictsAction;
  getUsers(): GetUsersAction;
  resetDistricts(): ResetDistrictAction;
  logClick: (log_message: string, user_id: number) => LogAction;
}

class IntersectionList extends React.Component<StateProps & DispatchProps, {}> {
  public componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    const { getDistricts, getUsers } = this.props;
    getDistricts();
    getUsers();
  }

  public componentDidUpdate(prevProps: StateProps): void {
    const { districts: prevDistricts, users: prevUsers } = prevProps;
    // eslint-disable-next-line no-shadow
    const { getDistricts, getUsers } = this.props;
    const { districts, users } = this.props;
    if (districts !== prevDistricts) {
      getDistricts();
    }
    if (users !== prevUsers) {
      getUsers();
    }
  }

  // public componentWillUnmount(): void {
  //   // eslint-disable-next-line no-shadow
  //   const { resetDistricts } = this.props;
  //   resetDistricts();
  // }

  public render(): JSX.Element {
    const {
      districts, isStaff, user_id, users,
    } = this.props;
    // const districtsProps = {
    //   // eslint-disable-next-line object-shorthand
    //   districts: districts,
    // };
    return (
      <div>
        <SideDrawer headerTitle={title} />
        <ContentFlexBox>
          <TableDiv>
            <IntersectionTable districts={districts} isStaff={isStaff} user_id={user_id} />
            <AddButton>{isStaff ? <AddIntersection users={users} /> : <div />}</AddButton>
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
  districts: state.districts,
  isStaff: isStaff(state),
  users: state.users,
  user_id: state.authentication.user_id,
});

const mapDispatchToProps: DispatchProps = {
  deleteExistingIntersection,
  getDistricts,
  getUsers,
  logClick,
  resetDistricts,
};
export default connect(mapStateToProps, mapDispatchToProps)(IntersectionList);

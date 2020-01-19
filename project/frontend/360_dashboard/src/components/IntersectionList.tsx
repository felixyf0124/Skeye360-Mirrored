/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import SideDrawer from './SideDrawer';
import IntersectionTable from './IntersectionTable';
import { RootState } from '../reducers/rootReducer';
import DisplayCount from './DisplayMovAVG';

import {
  STATE as districtState,
  GetDistrictsAction,
  getDistricts,
  resetIntersection,
  ResetDistrictAction,
} from '../contexts/districts';
import { deleteExistingIntersection, DeleteIntersectionAction } from '../contexts/intersection';
import { logClick, LogAction } from '../contexts/LogClicks';
import TrafficNews from './TrafficNews';
import {
  STATE as countState,
  GetCountAction,
  getCount,
} from '../contexts/countTime';

const title = 'Montreal';
interface StateProps {
  user_id: number;
  districts: districtState;
  count: countState;
}

interface DispatchProps {
  getDistricts(): GetDistrictsAction;
  resetIntersection(): ResetDistrictAction;
  deleteExistingIntersection: (id: string) => DeleteIntersectionAction;
  logClick: (log_message: string, user_id: number) => LogAction;
  getCount(): GetCountAction;
}

class IntersectionList extends React.Component<(StateProps & DispatchProps) | any> {
  public componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    const { getDistricts } = this.props;
    const { getCount } = this.props;
    getDistricts();
    getCount();
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
    const { count } = this.props;
    // const districtsProps = {
    //   // eslint-disable-next-line object-shorthand
    //   districts: districts,
    // };
    return (
      <div style={{ display: 'flex' }}>
        <SideDrawer headerTitle={title} />
        {districts[0] === undefined ? <div /> : <IntersectionTable districts={districts} />}
        <TrafficNews />
        <DisplayCount count={count}/>
      </div>
    );
  }
}
const mapStateToProps = (state: RootState): StateProps => ({
  user_id: state.authentication.user_id,
  districts: state.districts,
  count: state.countTime,
});

const mapDispatchToProps: DispatchProps = {
  getDistricts,
  resetIntersection,
  deleteExistingIntersection,
  logClick,
  getCount,
};
export default connect(mapStateToProps, mapDispatchToProps)(IntersectionList);

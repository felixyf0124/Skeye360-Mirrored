/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import SideDrawer from './SideDrawer';
import IntersectionTable from './IntersectionTable';
import { RootState } from '../reducers/rootReducer';

import {
  STATE as districtState,
  GetDistrictsAction,
  getDistricts,
  resetIntersection,
  ResetDistrictAction
} from '../contexts/districts';
import { connect } from 'react-redux';

interface StateProps {
  districts: districtState;
}

interface DispatchProps {
  getDistricts(): GetDistrictsAction;
  resetIntersection(): ResetDistrictAction;
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
    return (
      <div style={{ display: 'flex'}}>
        <SideDrawer />
        <IntersectionTable districts={districts} />
      </div>
    );
  }
}
const mapStateToProps = (state: RootState): StateProps => ({
  districts: state.districts,
});

const mapDispatchToProps: DispatchProps = {
  getDistricts,
  resetIntersection,
};
export default connect(mapStateToProps, mapDispatchToProps)(IntersectionList);

import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import GoogleMap from '../components/GoogleMap';
import Header from '../components/Header';
import SideDrawer from '../components/SideDrawer';

import {
  STATE as districtState,
  GetDistrictsAction,
  getDistricts,
  resetIntersection,
  ResetDistrictAction,
} from '../contexts/districts';

interface StateProps {
  districts: districtState;
}

interface DispatchProps {
  getDistricts(): GetDistrictsAction;
  resetIntersection(): ResetDistrictAction;
}

class SkeyeMap extends React.Component<(StateProps & DispatchProps) | any> {
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
      <div>
        <SideDrawer /> 
        <GoogleMap districts={districts} />
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

export default connect(mapStateToProps, mapDispatchToProps)(SkeyeMap);

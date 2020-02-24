import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import GoogleMap from '../components/GoogleMap';
import SideDrawer from '../components/SideDrawer';

import {
  STATE as districtState,
  GetDistrictsAction,
  getDistricts,
  resetDistricts,
  ResetDistrictAction,
} from '../contexts/districts';

interface StateProps {
  districts: districtState;
}

interface DispatchProps {
  getDistricts(): GetDistrictsAction;
  resetDistricts(): ResetDistrictAction;
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

  // public componentWillUnmount(): void {
  //   // eslint-disable-next-line no-shadow
  //   const { resetDistricts } = this.props;
  //   resetDistricts();
  // }

  public render(): JSX.Element {
    const { districts } = this.props;
    const title = 'Map';
    return (
      <div>
        <SideDrawer headerTitle={title} />
        <div style={{ height: '100vh', width: '100%' }}>
          <GoogleMap districts={districts} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  districts: state.districts,
});

const mapDispatchToProps: DispatchProps = {
  getDistricts,
  resetDistricts,
};

export default connect(mapStateToProps, mapDispatchToProps)(SkeyeMap);

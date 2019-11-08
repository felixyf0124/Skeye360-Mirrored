import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { RootState } from '../reducers/rootReducer';
import GoogleMap from '../components/GoogleMap';
import Header from '../components/Header';
import { STATE as districtState, GetDistrictsAction, getDistricts } from '../contexts/districts';

interface StateProps {
  authenticated: boolean;
  districts: districtState;
}

interface DispatchProps {
  getDistricts(): GetDistrictsAction;
}

class SkeyeMap extends React.Component<StateProps & DispatchProps> {
  public componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    const { getDistricts } = this.props;
    getDistricts();
  }

  public render(): JSX.Element {
    const { authenticated } = this.props;
    if (!authenticated) return <Redirect push to="/login" />;
    return (
      <div>
        <Header />
        <GoogleMap />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  authenticated: state.authentication.authenticated,
  districts: state.districts,
});

const mapDispatchToProps: DispatchProps = {
  getDistricts,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SkeyeMap);

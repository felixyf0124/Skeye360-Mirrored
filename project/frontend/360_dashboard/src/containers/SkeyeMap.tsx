import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import GoogleMap from '../components/GoogleMap';
import Header from '../components/Header';
import { STATE as districtState, GetDistrictsAction, getDistricts } from '../contexts/districts';

interface StateProps {
  districts: districtState;
}

interface DispatchProps {
  getDistricts(): GetDistrictsAction;
}

class SkeyeMap extends React.Component<StateProps & DispatchProps | any> {
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
    const { getDistricts } = this.props;
    getDistricts();
  }

  public render(): JSX.Element {
    const { districts } = this.props;
    return (
      <div>
        <Header />
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
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(SkeyeMap);

/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { push } from 'connected-react-router';
import Header from '../components/Header';
import { RootState } from '../reducers/rootReducer';
import {
  GetIntersectionAction,
  getExistingIntersection,
  resetIntersection,
  ResetIntersectionAction,
} from '../contexts/intersection';
import EditIntersectionForm from '../components/EditIntersectionForm';

interface StateProps {
  authenticated: boolean;
  username: string;

  intersection_id: string;
  latitude: string;
  longitude: string;
  intersection_name: string;
  district_id: string;

  error: string;
  success: boolean;
}

interface DispatchProps {
  historyPush: (url: string) => void;
  getExistingIntersection(id: string): GetIntersectionAction;
  resetIntersection(): ResetIntersectionAction;
}

class EditIntersection extends React.Component<StateProps & DispatchProps> {
  public componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    const { intersection_id, getExistingIntersection } = this.props;
    getExistingIntersection(intersection_id);
  }

  public componentWillUnmount(): void {
    // eslint-disable-next-line no-shadow
    const { resetIntersection } = this.props;
    resetIntersection();
  }

  public render(): JSX.Element {
    const {
      authenticated,
      intersection_id,
      latitude,
      longitude,
      intersection_name,
      district_id,
      success,
    } = this.props;
    if (!authenticated) return <Redirect push to="/login" />;
    if (success) {
      return (
        <div>
          <Header />
          <EditIntersectionForm
            intersection_id={intersection_id}
            latitude={latitude}
            longitude={longitude}
            intersection_name={intersection_name}
            district_id={district_id}
          />
        </div>
      );
    }
    return (
      <div>
        <Header />
      </div>
    );
  }
}


const mapStateToProps = (state: RootState): StateProps => ({
  authenticated: state.authentication.authenticated,
  username: state.authentication.username,

  intersection_id: state.router.location.pathname.substring(state.router.location.pathname.lastIndexOf('/') + 1),
  latitude: state.intersection.latitude,
  longitude: state.intersection.longitude,
  district_id: state.intersection.district_id,
  intersection_name: state.intersection.intersection_name,

  error: state.intersection.error,
  success: state.intersection.success,
});

const mapDispatchToProps: DispatchProps = {
  historyPush: push,
  getExistingIntersection,
  resetIntersection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditIntersection);

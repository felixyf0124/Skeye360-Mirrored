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
} from '../contexts/intersection';
import EditIntersectionForm from '../components/EditIntersectionForm';

interface StateProps {
  path: string;
  authenticated: boolean;
  username: string;

  intersection_id: string;
  latitude: string;
  longitude: string;
  intersection_name: string;
  district_id: string;

  error: string;
}

interface DispatchProps {
  historyPush: (url: string) => void;
  getExistingIntersection(id: string): GetIntersectionAction;
}

class EditIntersection extends React.Component<StateProps & DispatchProps> {
  public componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    const { intersection_id, getExistingIntersection } = this.props;
    getExistingIntersection(intersection_id);
  }

  public render(): JSX.Element {
    const {
      authenticated,
      intersection_id,
      latitude,
      longitude,
      intersection_name,
      district_id,

    } = this.props;
    if (!authenticated) return <Redirect push to="/login" />;
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
}


const mapStateToProps = (state: RootState): StateProps => ({
  path: '/streetview/add',
  authenticated: state.authentication.authenticated,
  username: state.authentication.username,

  intersection_id: state.router.location.pathname.substring(state.router.location.pathname.lastIndexOf('/') + 1),
  latitude: state.intersection.latitude,
  longitude: state.intersection.longitude,
  district_id: state.intersection.district_id,
  intersection_name: state.intersection.intersection_name,

  error: state.intersection.error,
});

const mapDispatchToProps: DispatchProps = {
  historyPush: push,
  getExistingIntersection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditIntersection);

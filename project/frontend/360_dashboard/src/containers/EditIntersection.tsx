/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import Header from '../components/Header';
import { RootState } from '../reducers/rootReducer';
import {
  resetIntersection,
  ResetIntersectionAction,
} from '../contexts/intersection';
import EditIntersectionForm from '../components/EditIntersectionForm';

interface StateProps {
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
  resetIntersection(): ResetIntersectionAction;
}

class EditIntersection extends React.Component<StateProps & DispatchProps> {
  public componentWillUnmount(): void {
    // eslint-disable-next-line no-shadow
    const { resetIntersection } = this.props;
    resetIntersection();
  }

  public render(): JSX.Element {
    const {
      success,
    } = this.props;
    if (success) {
      return (
        <div>
          <Header />
          <EditIntersectionForm />
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
  resetIntersection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditIntersection);

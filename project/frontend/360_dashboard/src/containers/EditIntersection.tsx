/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import { RootState } from '../reducers/rootReducer';
import {
  getExistingIntersection,
  resetIntersection as resetCurrentIntersection,
  ResetIntersectionAction,
} from '../contexts/intersection';
import EditIntersectionForm from '../components/EditIntersectionForm';
import SideDrawer from '../components/SideDrawer';

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
  getExistingIntersection: (id: string) => any;
  historyPush: (url: string) => void;
  resetCurrentIntersection(): ResetIntersectionAction;
}

class EditIntersection extends React.Component<StateProps & DispatchProps> {
  // component mount will fetch existing intersection
  public componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    const { intersection_id, getExistingIntersection } = this.props;
    getExistingIntersection(intersection_id);
  }

  public componentWillUnmount(): void {
    // eslint-disable-next-line no-shadow
    const { resetCurrentIntersection } = this.props;
    resetCurrentIntersection();
  }

  public render(): JSX.Element {
    const { success, intersection_name } = this.props;
    // if (district_id === '') return <Redirect to="/" />;
    const headerTitle = `Edit: ${intersection_name}`;

    if (success) {
      return (
        <div>
          <SideDrawer headerTitle={headerTitle} />
          {intersection_name === '' ? <div /> : <EditIntersectionForm />}
        </div>
      );
    }
    return (
      <div>
        <SideDrawer headerTitle="Edit" />
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  username: state.authentication.username,

  intersection_id: state.router.location.pathname.substring(
    state.router.location.pathname.lastIndexOf('/') + 1,
  ),
  latitude: state.intersection.latitude,
  longitude: state.intersection.longitude,
  district_id: state.intersection.district_id,
  intersection_name: state.intersection.intersection_name,

  error: state.intersection.error,
  success: state.intersection.success,
});

const mapDispatchToProps: DispatchProps = {
  getExistingIntersection,
  resetCurrentIntersection,
  historyPush: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditIntersection);

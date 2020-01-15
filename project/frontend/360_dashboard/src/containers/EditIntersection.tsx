/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import styled from 'styled-components';
import { RootState } from '../reducers/rootReducer';
import {
  getExistingIntersection,
  resetIntersection as resetCurrentIntersection,
  ResetIntersectionAction,
} from '../contexts/intersection';
import EditIntersectionForm from '../components/EditIntersectionForm';
import { Response as cameraResponse } from '../api/camera';
import SideDrawer from '../components/SideDrawer';
import EditCameraForm from '../components/EditCameraForm';
import AddCameraForm from '../components/AddCameraForm';

const Content = styled.div`
  margin-top: 8rem;
`;

// Generic flexboxes styling
const VerticalFlexBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: stretch;
  align-content: stretch;
`;

const HorizontalFlexBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: stretch;
  align-content: stretch;
`;

interface StateProps {
  username: string;

  intersection_id: string;
  latitude: string;
  longitude: string;
  intersection_name: string;
  district_id: string;

  cameras: [cameraResponse] | any;

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
    const {
      success, intersection_name, cameras, intersection_id,
    } = this.props;
    // if (district_id === '') return <Redirect to="/" />;
    const headerTitle = `Edit: ${intersection_name}`;

    if (success) {
      return (
        <Content>
          <SideDrawer headerTitle={headerTitle} />
          <HorizontalFlexBox>
            {intersection_name === '' ? <div /> : <EditIntersectionForm />}
            <VerticalFlexBox>
              {cameras[0] === undefined ? (
                <div />
              ) : (
                cameras.map((camera: cameraResponse) => (
                  <EditCameraForm
                    key={camera.id}
                    id={String(camera.id)}
                    camera_url={camera.camera_url}
                    intersection_id={String(camera.intersection_id)}
                  />
                ))
              )}
              <AddCameraForm intersection_id={Number(intersection_id)} />
            </VerticalFlexBox>
          </HorizontalFlexBox>
        </Content>
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
  ...state,
  username: state.authentication.username,

  // intersection
  intersection_id: state.router.location.pathname.substring(
    state.router.location.pathname.lastIndexOf('/') + 1,
  ),
  latitude: state.intersection.latitude,
  longitude: state.intersection.longitude,
  district_id: state.intersection.district_id,
  intersection_name: state.intersection.intersection_name,

  // cameras
  cameras: state.intersection.cameras,

  error: state.intersection.error,
  success: state.intersection.success,
});

const mapDispatchToProps: DispatchProps = {
  getExistingIntersection,
  resetCurrentIntersection,
  historyPush: push,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditIntersection);

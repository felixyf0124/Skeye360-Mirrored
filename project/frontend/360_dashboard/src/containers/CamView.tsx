/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import LinearProgress from '@material-ui/core/LinearProgress';
import { RootState } from '../reducers/rootReducer';
import { getExistingCamera } from '../contexts/camera';
import SideDrawer from '../components/SideDrawer';
import TabsComponent from '../components/camViewComponents/TabsComponent';

// DIV inside the sideDrawer
const Body = styled.div`
  // margin-left: 1vw;
  display: flex;
  margin: 1rem;
  margin-top: 5rem;
`;

const Loader = styled.div`
  margin-top: 4rem;
  text-align: center;
`;

interface StateProps {
  camera_loaded_id: string;
  camera_path_id: string;
  camera_url: string;
  error: string;
  intersectionName: string;
  success: boolean;
  user_id: number;
}

interface DispatchProps {
  getExistingCamera: (id: string) => any;
}

class CamView extends React.Component<StateProps & DispatchProps> {
  public componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    const { camera_path_id, getExistingCamera } = this.props;
    getExistingCamera(camera_path_id);
  }

  public render(): JSX.Element {
    const {
      camera_loaded_id, camera_path_id, intersectionName, success,
    } = this.props;
    if (success && camera_loaded_id === camera_path_id) {
      // eslint-disable-next-line consistent-return
      return (
        <div>
          <SideDrawer headerTitle={intersectionName} />
          <Body>
            <TabsComponent />
          </Body>
        </div>
      );
    }

    return (
      <div>
        <SideDrawer headerTitle="Edit" />
        <Loader>
          <LinearProgress />
        </Loader>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  camera_loaded_id: String(state.camera.id),
  camera_path_id: state.router.location.pathname.substring(
    state.router.location.pathname.lastIndexOf('/') + 1,
  ),
  camera_url: state.camera.camera_url,
  error: state.intersection.error,
  intersectionName: state.intersection.intersection_name,
  success: state.camera.success,
  user_id: state.authentication.user_id,
});

const mapDispatchToProps: DispatchProps = {
  getExistingCamera,
};

export default connect(mapStateToProps, mapDispatchToProps)(CamView);

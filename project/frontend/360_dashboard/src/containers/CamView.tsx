/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../reducers/rootReducer';
import { getExistingCamera } from '../contexts/camera';
import SideDrawer from '../components/SideDrawer';
import TabsComponent from '../components/camViewComponents/TabsComponent';

// DIV inside the sideDrawer
const Body = styled.div`
  display: flex;
  margin: 1rem;
  margin-top: 5rem;
`;

interface StateProps {
  camera_id: string;
  camera_url: string;
  intersectionName: string;
  error: string;
  user_id: number;
}

interface DispatchProps {
  getExistingCamera: (id: string) => any;
}

class CamView extends React.Component<StateProps & DispatchProps> {
  public componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    const { camera_id, getExistingCamera } = this.props;
    getExistingCamera(camera_id);
  }

  public render(): JSX.Element {
    const { intersectionName } = this.props;

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
}

const mapStateToProps = (state: RootState): StateProps => ({
  camera_id: state.router.location.pathname.substring(
    state.router.location.pathname.lastIndexOf('/') + 1,
  ),
  camera_url: state.camera.camera_url,
  intersectionName: state.intersection.intersection_name,
  error: state.intersection.error,
  user_id: state.authentication.user_id,
});

const mapDispatchToProps: DispatchProps = {
  getExistingCamera,
};

export default connect(mapStateToProps, mapDispatchToProps)(CamView);

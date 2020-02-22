import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../reducers/rootReducer';
import { getExistingCamera } from '../../contexts/camera';

// Generic flexboxes styling
const VerticalFlexBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: space-around;
  align-content: stretch;
`;

// Single Container
const InnerDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`;

// Empty camera feed container
// To be modified when the camera feed is added
const CamFeed = styled.img`
  width: 70vw;
  height: 35vw;
  margin: 1rem;
  background-color: #212121;
  display: flex;
  justify-content: center;
  justify-content: center;
  align-items: center;
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

  class CameraComponent extends React.Component<StateProps & DispatchProps> {
    public componentDidMount(): void {
      // eslint-disable-next-line no-shadow
      const { camera_id, getExistingCamera } = this.props;
      getExistingCamera(camera_id);
    }
  
    public render(): JSX.Element {
      const { intersectionName, camera_url } = this.props;
  
      // eslint-disable-next-line consistent-return
      return (
        <div>
          <VerticalFlexBox>
            <InnerDiv>
              <h2>Live Camera Feed</h2>
              <CamFeed src={`http://${camera_url}/cam`} alt="Loading..." />
            </InnerDiv>
          </VerticalFlexBox>
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
  
  export default connect(mapStateToProps, mapDispatchToProps)(CameraComponent);
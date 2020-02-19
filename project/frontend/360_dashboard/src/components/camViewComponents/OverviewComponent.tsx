import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../reducers/rootReducer';
import SidebarComponent from './SidebarComponent'
import { SKEYE_WHITE } from '../../css/custom';
import { getExistingCamera } from '../../contexts/camera';
import Simulator from './../../containers/simulator/Scene';

// DIV inside the sideDrawer
const Body = styled.div`
//   margin-left: 10rem;
  margin-top: 5rem;
`;

// Single Container Vertical
const InnerDivVerticalFirstSim = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`;

// Single Container Vertical
const InnerDivVerticalSecondSim = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  margin-left: 20vw;
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
  width: 40vw;
  height: 20vw;
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

// Generic flexboxes styling
const VerticalFlexBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: space-around;
  align-content: stretch;
`;

// Generic flexboxes styling
const HorizontalFlexBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: space-around;
  align-content: stretch;
  padding: 0px;
`;

// Single Container Horizontal
const InnerDivHorizon = styled.div`
  display: flex;
  width: 100vw;
  flex-direction: row;
  color: white;
  margin-left: 10vw;
`;

// Single Container Vertical
const InnerDivVertical = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`;

// Container for the simulator
const SimContainer = styled.div`
  width: 10vw;
  height: 10vw;
//   margin-left: 20rem;
  display: flex;
  justify-content: center;
  margin: 1rem;
`;

const skeyeStyles = {
    title: {
        color: SKEYE_WHITE,
        fontSize: 28,
        marginBottom: 4,
        fontWeight: 900,
    },
    header: {
        color: SKEYE_WHITE,
        fontSize: 20,
        marginBottom: 4,
        fontWeight: 900,
    },
}

class OverviewComponent extends React.Component<StateProps & DispatchProps> {
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
                <HorizontalFlexBox>
                    <SidebarComponent></SidebarComponent>
                    <VerticalFlexBox>
                        <InnerDivVertical>
                            <h2>Live Camera Feed</h2>
                            <CamFeed src={`http://${camera_url}/cam`} alt="Loading..." />
                        </InnerDivVertical>
                        <InnerDivVertical>
                            <text style={ skeyeStyles.header }>Default Traffic Light Setting</text>
                            <SimContainer>
                            <Simulator isSmartTL={false} />
                            </SimContainer>
                        </InnerDivVertical>
                    </VerticalFlexBox>
                    <VerticalFlexBox>
                        <InnerDivVertical>
                            <h2>Live Camera Feed</h2>
                            <CamFeed src={`http://${camera_url}/cam`} alt="Loading..." />
                        </InnerDivVertical>
                        <InnerDivVertical>
                            <text style={ skeyeStyles.header }>Optimized Traffic Light Setting</text>
                            <SimContainer>
                            <Simulator isSmartTL/>
                            </SimContainer>
                        </InnerDivVertical>
                    </VerticalFlexBox>
                </HorizontalFlexBox>
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

export default connect(mapStateToProps, mapDispatchToProps)(OverviewComponent);


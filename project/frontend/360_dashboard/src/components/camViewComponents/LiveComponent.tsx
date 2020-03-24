import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../reducers/rootReducer';
import SidebarComponent from './SidebarComponent';
import { SKEYE_WHITE, SKEYE_LIGHT_BLACK, SKEYE_BRIGHT_GREEN } from '../../css/custom';
import { getExistingCamera } from '../../contexts/camera';
import Simulator from '../../containers/simulator/Scene';

interface SimProps {
  tlMode: number;
  onChangeTLMode: any;
  toggles: any;
  tlStop: boolean;
  onClickTLStop: any;
  tlCombStates: Array<{
    direction: string;
    state: string;
    state2: string;
    countDown: string;
    countDown2: string;
    totalTime: string; // G+Y
    totalTime2: string; // G+Y
  }>;

  onTLUpdate: any;
  key: any;
}

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

// Empty camera feed container
// To be modified when the camera feed is added
const CamFeed = styled.img`
  width: 38vw;
  height: 19.5vw;
  margin: 1rem;
  background-color: #212121;
  display: flex;
  justify-content: center;
  justify-content: center;
  align-items: center;
`;

// Horizontal flexbox styling
const HorizontalFlexBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: space-around;
  align-content: stretch;
  padding: 0px;
  width: 100%;
`;

// Single Container Horizontal
const InnerDivHorizon = styled.div`
  display: flex;
  flex-direction: row;
  color: white;
  //   margin-left: 10vw;
  // margin-top: -20vh;
  margin-top: -0.4vh;
`;

// Single Container Vertical
const InnerDivVerticalCam = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  // margin-top: -10vh;
  // margin-top: -20vh;
`;

// Container for the simulator
const SimContainer = styled.div`
  //   width: 11%;
  //   height: 11%;
  display: flex;
  justify-content: center;
  margin: 1rem;
`;

// Single Container Vertical for the simulator
const InnerDivVerticalSim = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`;

const CamContainer = styled.div`
  display: flex;
  justify-content: center;
  color: white;
  height: 9vw;
`;

// Custom styling
const skeyeStyles = {
  Title: {
    color: SKEYE_WHITE,
    fontSize: 28,
    marginBottom: 4,
    fontWeight: 900,
  },
  Header: {
    color: SKEYE_WHITE,
    fontSize: 20,
    marginBottom: 4,
    fontWeight: 900,
  },
  BoxLeft: {
    width: '18vw',
    height: '20vw',
    backgroundColor: SKEYE_LIGHT_BLACK,
    marginLeft: '-8.2vw',
    marginTop: '2.5vw',
  },
  BoxRight: {
    width: '18vw',
    height: '20vw',
    backgroundColor: SKEYE_LIGHT_BLACK,
    marginLeft: '2vw',
    marginTop: '2.5vw',
  },
  BoxTextTitle: {
    color: SKEYE_WHITE,
    fontSize: 20,
    fontWeight: 700,
    marginTop: 40,
  },
  BoxTextValue: {
    color: SKEYE_WHITE,
    fontSize: 38,
    fontWeight: 700,
    marginTop: 20,
  },
  BoxTextUnit: {
    color: SKEYE_WHITE,
    fontSize: 18,
    fontWeight: 400,
    marginTop: -20,
  },
  BoxTextPercentage: {
    color: SKEYE_BRIGHT_GREEN,
    fontSize: 32,
    fontWeight: 600,
    marginTop: 20,
    marginRight: 15,
  },
  BoxTextUpdated: {
    color: SKEYE_WHITE,
    fontSize: 22,
    fontWeight: 200,
    marginTop: 10,
  },
  GreenArrow: {
    color: SKEYE_BRIGHT_GREEN,
    fontSize: 70,
    paddingBottom: 9,
    marginRight: -15,
  },
  Simulator: {
    paddingTop: 50,
  },
};

class LiveComponent extends React.Component<
  SimProps & StateProps & DispatchProps,
  { tlMode: number }
  > {
  public componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    const { camera_id, getExistingCamera } = this.props;
    getExistingCamera(camera_id);
  }

  public render(): JSX.Element {
    const {
      camera_url,
      tlMode,
      onChangeTLMode,
      toggles,
      tlStop,
      onClickTLStop,
      tlCombStates,
      onTLUpdate,
    } = this.props;
    // eslint-disable-next-line consistent-return
    return (
      <div>
        <HorizontalFlexBox>
          <SidebarComponent
            isLiveFeed
            tlMode={tlMode}
            onChangeTLMode={onChangeTLMode}
            onClickTLStop={onClickTLStop}
            tlCombStates={tlCombStates}
            keyValue="1"
          />
          <InnerDivHorizon>
            <InnerDivVerticalCam>
              <text style={skeyeStyles.Header}>Live Camera Feed</text>
              <CamContainer>
                <CamFeed src={`http://${camera_url}/cam`} alt="Loading..." />
              </CamContainer>
            </InnerDivVerticalCam>
            <InnerDivVerticalSim>
              <text style={skeyeStyles.Header}>Simulator with Live Feed</text>
              <SimContainer>
                <Simulator
                  isLiveFeed
                  isSmartTL={false}
                  tl_mode={tlMode}
                  toggles={toggles}
                  onSimuStart
                  onSimuClickUpdata={null}
                  tlStop={tlStop}
                  onTLUpdate={onTLUpdate}
                  updatePassedVehicles={null}
                  simuWidthRatio={0.38}
                  resolutionRatio={38 / 19.5}
                  onWaitingTimeUpdate={null}
                  onLoopCDUpdate={null}
                />
              </SimContainer>
            </InnerDivVerticalSim>
          </InnerDivHorizon>
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

export default connect(mapStateToProps, mapDispatchToProps)(LiveComponent);

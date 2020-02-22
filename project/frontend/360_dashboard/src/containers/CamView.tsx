/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../reducers/rootReducer';
import Simulator from './simulator/Scene';
// import AvgWaitTimeChartComparison from '../components/AvgWaitTimeChartComparison';
import { getExistingCamera } from '../contexts/camera';
import SideDrawer from '../components/SideDrawer';
// import { SKEYE_WHITE } from '../css/custom';
import TabsComponent from '../components/camViewComponents/TabsComponent';

// Generic flexboxes styling
const VerticalFlexBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: space-around;
  align-content: stretch;
`;

// DIV inside the sideDrawer
const Body = styled.div`
  margin-left: 5rem;
  margin-top: 5rem;
`;

// Container Row
// const DivRow = styled.div`
//   display: flex;
//   flex-direction: row;
//   justify-content: space-around;
//   margin-top: 2rem;
// `;

// Outer Container
// const OuterDiv = styled.div`
//   margin-left: 5rem;
//   margin-top: 5rem;
//   display: flex;
//   flex-direction: column;
// `;

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

// Container for chart
// const ChartContainer = styled.div`
//   background-color: ${SKEYE_WHITE};
//   margin: 1rem;
//   position: relative;
//   width: 30vw;
// `;

// Container for the simulator
const SimContainer = styled.div`
  width: 70vw;
  height: 25vw;
  margin-left: 20rem;
  display: flex;
  justify-content: center;
  margin: 1rem;
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
    const { intersectionName, camera_url } = this.props;

    // eslint-disable-next-line consistent-return
    return (
      <div>
        <SideDrawer headerTitle={intersectionName} />
        <Body>
          <TabsComponent></TabsComponent>
          {/* <VerticalFlexBox>
            <InnerDiv>
              <h2>Live Camera Feed</h2>
              <CamFeed src={`http://${camera_url}/cam`} alt="Loading..." />
            </InnerDiv> */}
            {/* <InnerDiv>
              <h2>Data Analytics</h2>
              <ChartContainer>
                <AvgWaitTimeChartComparison />
              </ChartContainer>
            </InnerDiv> */}
            {/* <InnerDiv>
              <h2>Simulation of Traffic</h2>
              <h3>Optimized Traffic Light Setting</h3>
              <SimContainer>
                <Simulator isSmartTL />
              </SimContainer>
              <h3>Default Traffic Light Setting</h3>
              <SimContainer>
                <Simulator isSmartTL={false} />
              </SimContainer>
            </InnerDiv>
          </VerticalFlexBox> */}
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

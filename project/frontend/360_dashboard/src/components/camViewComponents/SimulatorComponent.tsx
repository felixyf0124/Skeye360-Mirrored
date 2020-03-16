import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import SidebarComponent from './SidebarComponent';
import Simulator from '../../containers/simulator/Scene';
import { SKEYE_WHITE } from '../../css/custom';

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

// Horizontal flexbox styling
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

// Single Container Vertical for the first simulator
const InnerDivVerticalFirstSim = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`;

// Single Container Vertical for the second simulator
const InnerDivVerticalSecondSim = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  margin-left: 20vw;
`;

// Container for the simulator
const SimContainer = styled.div`
  width: 20vw;
  height: 20vw;
  margin-left: 20rem;
  display: flex;
  justify-content: center;
  margin: 1rem;
`;

const ContentBlock = styled.div`
  display: flex;
  width: 80vw;
  margin:0vw;
  flow: left;
`;

const VerticalBlock = styled.div`
  display:block;
  width: 100vw;
  height: auto;
  flex-direction:column;
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
    fontWeight: 600,
    height:35,
  },
};





const SimulatorComponent = (props: SimProps | any): JSX.Element => {
  // eslint-disable-next-line consistent-return
  const {
    tlMode, onChangeTLMode, toggles, tlStop, onClickTLStop,
    tlCombStates, onTLUpdate,
  } = props;

  const [passedVehicles, setPassedVehicles] = React.useState([
    {direction:"",passedNum:0},
    {direction:"",passedNum:0},
    {direction:"",passedNum:0},
    {direction:"",passedNum:0},
  ]);
  
  const [passedVehicles2, setPassedVehicles2] = React.useState([
    {direction:"",passedNum:0},
    {direction:"",passedNum:0},
    {direction:"",passedNum:0},
    {direction:"",passedNum:0},
  ]);
  
  const updatePassedVehicles = 
  (passedVehicles: Array<{direction:string,passedNum:number}>,
    isSmartTL:boolean): 
  void => {
    if (isSmartTL) {
      setPassedVehicles2(passedVehicles);
      console.log(passedVehicles2);
    } else {
      setPassedVehicles(passedVehicles);
      console.log(passedVehicles);
    }
  };

  return (
    <div>
      <text style={skeyeStyles.Title}>Simulation of Traffic</text>
      <HorizontalFlexBox>
        <SidebarComponent
          tlMode={tlMode}
          onChangeTLMode={onChangeTLMode}
          onClickTLStop={onClickTLStop}
          tlCombStates={tlCombStates}
        // tlStates2={tlStates2}
          keyValue="2"
        />
        <ContentBlock>

        <VerticalBlock>
        <InnerDivHorizon>
          <div style={{height:`20px`}}>
            <text style={skeyeStyles.Header}>Default Traffic Light</text>
            </div>
            <SimContainer>
              <Simulator
                isLiveFeed={false}
                isSmartTL={false}
                tl_mode={tlMode}
                toggles={toggles}
                tlStop={tlStop}
                onTLUpdate={onTLUpdate}
                updatePassedVehicles={updatePassedVehicles}
                simuWidthRatio={0.38}
                resolutionRatio={38 / 19.5}
              />
            </SimContainer>
         
          
        </InnerDivHorizon>
        <InnerDivHorizon>
          
            <text style={skeyeStyles.Header}>Smart Traffic Light</text>
            <SimContainer>
              <Simulator
                isLiveFeed={false}
                isSmartTL={true}
                tl_mode={tlMode}
                toggles={toggles}
                tlStop={tlStop}
                onTLUpdate={onTLUpdate}
                updatePassedVehicles={updatePassedVehicles}
                simuWidthRatio={0.38}
                resolutionRatio={38 / 19.5}
              />
            </SimContainer>
        </InnerDivHorizon>
        </VerticalBlock>
        </ContentBlock>
      </HorizontalFlexBox>
    </div>
  );
};

export default connect()(SimulatorComponent);

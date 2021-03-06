import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import HelpIcon from '@material-ui/icons/Help';
import Simulator from '../../containers/simulator/Scene';
import SidebarComponent from './SidebarComponent';
import { SKEYE_WHITE, SKEYE_BLUE } from '../../css/custom';
import DataTabsComponent from './DataTabsComponent';
import helpImg from '../../images/helpImg02.png';

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
  justify-content: space-around;
  align-items: space-around;
`;

// Single Container Horizontal
const InnerDivHorizon = styled.div`
  display: flex;
  flex-direction: row;
  color: white;
  margin-left: 4.5vw;
`;

// Container for the simulator
const SimContainer = styled.div`
  width: 20vw;
  height: 20vw;
  display: flex;
  justify-content: center;
  margin: 1rem;
  margin-bottom: -1rem;
`;

const ContentBlock = styled.div`
  display: flex;
  width: 80vw;
  margin:0vw;
  flow: left;
`;

const VerticalBlock = styled.div`
  display: flex;
  margin-bottom: -3vh;
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
    marginBottom: 2,
    fontWeight: 600,
    height: 35,
    marginLeft: -100,
  },
  HeaderCar: {
    color: SKEYE_WHITE,
    fontSize: 20,
    marginTop: 100,
    marginBottom: 4,
    fontWeight: 600,
    height: 35,
  },
  NumCar: {
    color: SKEYE_WHITE,
    fontSize: 30,
    marginTop: 50,
    marginBottom: 4,
    fontWeight: 600,
    height: 35,
  },
};

let passedVehicles = [
  { direction: '', passedNum: 0 },
  { direction: '', passedNum: 0 },
  { direction: '', passedNum: 0 },
  { direction: '', passedNum: 0 },
];

let passedVehicles2 = [
  { direction: '', passedNum: 0 },
  { direction: '', passedNum: 0 },
  { direction: '', passedNum: 0 },
  { direction: '', passedNum: 0 },
];

const SimulatorWithTabsComponent = (props: SimProps | any): JSX.Element => {
  // eslint-disable-next-line consistent-return
  const {
    tlMode, onChangeTLMode, toggles, tlStop, onClickTLStop,
    tlCombStates, onTLUpdate,
  } = props;

  const [onSimuStart, setOnSimuStart] = React.useState(false);

  const onClickSimuStart = (): void => {
    setOnSimuStart(true);
  };

  const onSimuStartReset = (): void => {
    setOnSimuStart(false);
  };

  function updatePassedVehicles(pVehicles: Array<{
    direction: string;
    passedNum: number;
  }>, isSmartTL: boolean): void {
    if (isSmartTL) {
      passedVehicles2 = pVehicles;
    } else {
      passedVehicles = pVehicles;
    }
  }

  let ttlPassedCars = 0;
  ttlPassedCars
    += passedVehicles[0].passedNum
    + passedVehicles[1].passedNum
    + passedVehicles[2].passedNum
    + passedVehicles[3].passedNum;

  let ttlPassedCars2 = 0;
  ttlPassedCars2
    += passedVehicles2[0].passedNum
    + passedVehicles2[1].passedNum
    + passedVehicles2[2].passedNum
    + passedVehicles2[3].passedNum;

  const [cumulativeWaitingTime, setCumulativeWaitingTime] = React.useState(0);
  const [cumulativeWaitingTime2, setCumulativeWaitingTime2] = React.useState(0);

  const onWaitingTimeUpdate = (wTime: number, isSmartTL: boolean):
    void => {
    if (isSmartTL) {
      setCumulativeWaitingTime2(wTime);
    } else {
      setCumulativeWaitingTime(wTime);
    }
  };

  const [loopCountDown, setLoopCountDown] = React.useState(0);
  const [loopCountDown2, setLoopCountDown2] = React.useState(0);
  const updateLoopCountDown = (loopCD: number, isSmartTL: boolean):
    void => {
    if (isSmartTL) {
      setLoopCountDown2(loopCD);
    } else {
      setLoopCountDown(loopCD);
    }
  };

  return (
    <div>
      <HorizontalFlexBox>
        <SidebarComponent
          isLiveFeed={false}
          tlMode={tlMode}
          tlStop={tlStop}
          onChangeTLMode={onChangeTLMode}
          onClickTLStop={onClickTLStop}
          tlCombStates={tlCombStates}
          onClickSimuStart={onClickSimuStart}
          keyValue="2"
          loopCountDown={loopCountDown}
          loopCountDown2={loopCountDown2}
        />
        <ContentBlock>

          <VerticalBlock>
            <InnerDivHorizon>
              <VerticalBlock>
                <div style={{ height: '2vh' }}>
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <text style={skeyeStyles.Header}>
                            Default Traffic Light
                          </text>
                        </td>
                        <td>
                          <Tooltip
                            title={<img style={{ width: '16rem' }} src={helpImg} alt="help img" />}
                          >
                            <Button style={{ margin: 0 }}><HelpIcon style={{ color: SKEYE_BLUE, fontSize: '14px' }} /></Button>
                          </Tooltip>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  {/* <text style={skeyeStyles.Header}>Default Traffic Light</text> */}
                </div>
                <SimContainer>
                  <Simulator
                    isLiveFeed={false}
                    onSimuClickUpdata={onSimuStartReset}
                    onSimuStart={onSimuStart}
                    isSmartTL={false}
                    tl_mode={tlMode}
                    toggles={toggles}
                    tlStop={tlStop}
                    onTLUpdate={onTLUpdate}
                    updatePassedVehicles={updatePassedVehicles}
                    simuWidthRatio={0.327}
                    resolutionRatio={38 / 19.5}
                    onWaitingTimeUpdate={onWaitingTimeUpdate}
                    onLoopCDUpdate={updateLoopCountDown}
                  />
                </SimContainer>
              </VerticalBlock>
              <DataTabsComponent
                chartID="first"
                ttlPassedCars={ttlPassedCars}
                passedVehicles={passedVehicles}
                waitingTime={cumulativeWaitingTime}
              />
            </InnerDivHorizon>

            <InnerDivHorizon>
              <VerticalBlock>
                <div style={{ height: '2vh' }}>
                  {/* <text style={skeyeStyles.Header}>Optimized Traffic Light</text> */}
                  <table>
                    <tbody>
                      <tr>
                        <td>
                          <text style={skeyeStyles.Header}>
                            Optimized Traffic Light
                          </text>
                        </td>
                        <td>
                          <Tooltip
                            title={<img style={{ width: '16rem' }} src={helpImg} alt="help img" />}
                          >
                            <Button style={{ margin: 0 }}><HelpIcon style={{ color: SKEYE_BLUE, fontSize: '14px' }} /></Button>
                          </Tooltip>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <SimContainer>
                  <Simulator
                    isLiveFeed={false}
                    isSmartTL
                    onSimuStart={onSimuStart}
                    onSimuClickUpdata={onSimuStartReset}
                    tl_mode={tlMode}
                    toggles={toggles}
                    tlStop={tlStop}
                    onTLUpdate={onTLUpdate}
                    updatePassedVehicles={updatePassedVehicles}
                    simuWidthRatio={0.327}
                    resolutionRatio={38 / 19.5}
                    onWaitingTimeUpdate={onWaitingTimeUpdate}
                    onLoopCDUpdate={updateLoopCountDown}
                  />
                </SimContainer>
              </VerticalBlock>
              <DataTabsComponent
                chartID="second"
                ttlPassedCars={ttlPassedCars2}
                passedVehicles={passedVehicles2}
                waitingTime={cumulativeWaitingTime2}
              />
            </InnerDivHorizon>
          </VerticalBlock>
        </ContentBlock>
      </HorizontalFlexBox>
    </div>
  );
};

export default connect()(SimulatorWithTabsComponent);

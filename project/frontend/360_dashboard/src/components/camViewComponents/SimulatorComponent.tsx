import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../reducers/rootReducer';
import SidebarComponent from './SidebarComponent'
import Simulator from './../../containers/simulator/Scene';
import { SKEYE_WHITE } from '../../css/custom';
import { makeStyles, Theme } from '@material-ui/core';


// interface SimProps {
//   tl_mode: number;
  
// }

// DIV inside the sideDrawer
const Body = styled.div`
//   margin-left: 10rem;
  margin-top: 5rem;
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
  height: 15vw;
  margin-left: 20rem;
  display: flex;
  justify-content: center;
  margin: 1rem;
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
}

const SimulatorComponent = ():JSX.Element=> {
    // eslint-disable-next-line consistent-return
    const modeId = 0;
    return (
        <div>
            <text style={ skeyeStyles.Title }>Simulation of Traffic</text>
            <HorizontalFlexBox>
                <SidebarComponent tl_mode={modeId}></SidebarComponent>
                <InnerDivHorizon>
                    <InnerDivVerticalFirstSim>
                        <text style={ skeyeStyles.Header }>Optimized Traffic Light Setting</text>
                        <SimContainer>
                        <Simulator isSmartTL />
                        </SimContainer>
                    </InnerDivVerticalFirstSim>
                    <InnerDivVerticalSecondSim>
                        <text style={ skeyeStyles.Header }>Default Traffic Light Setting</text>
                        <SimContainer>
                        <Simulator isSmartTL={false} />
                        </SimContainer>
                    </InnerDivVerticalSecondSim>
                </InnerDivHorizon>
            </HorizontalFlexBox>
        </div>
    );
}

export default connect()(SimulatorComponent);

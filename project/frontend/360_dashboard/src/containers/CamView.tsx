/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../reducers/rootReducer';
import Simulator from './simulator/Scene';
import AvgWaitTimeChartComparison from '../components/AvgWaitTimeChartComparison';
import {
  getExistingIntersection,
} from '../contexts/intersection';
import { getDistricts } from '../contexts/districts';
import SideDrawer from '../components/SideDrawer';
import { SKEYE_WHITE } from '../css/custom';

// Container Row
const DivRow = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  margin-top: 2rem;
`;

// Outer Container
const OuterDiv = styled.div`
  margin-left: 5rem;
  margin-top: 5rem; 
  display: flex;
  flex-direction: column;
`;

// Single Container
const InnerDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
`;

const CamFeed = styled.div`
  width: 30vw;
  margin: 1rem;
  background-color: #212121;
  display: flex;
  justify-content: center; 
  height: 20vw;
  justify-content: center;
  align-items: center;
`;

const ChartContainer = styled.div`
  background-color: ${SKEYE_WHITE};
  width: 30vw;
  margin: 1rem;
  display: flex;
  justify-content: center;
`;

const SimContainer = styled.div`
  display: flex;
  justify-content: center;
  margin: 1rem;
`;

interface StateProps {
  intersectionId: string;
  intersectionName: string;
  error: string;
  user_id: number;
}

interface DispatchProps {
  getExistingIntersection: (id: string) => any;
  getDistricts: () => any;
}

class CamView extends React.Component<StateProps & DispatchProps> {
  public componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    const { intersectionId, getExistingIntersection } = this.props;
    getExistingIntersection(intersectionId);
  }

  public render(): JSX.Element {
    const { intersectionName } = this.props;


    // eslint-disable-next-line consistent-return
    return (
      <div>
        <SideDrawer headerTitle={intersectionName} />
        <OuterDiv>
          <DivRow>
            <InnerDiv>
              <h2>Live Camera Feed</h2>
              <CamFeed>
                <h3>Camera Feed Coming Soon</h3>
              </CamFeed>
            </InnerDiv>
            <InnerDiv>
              <h2>Data Analytics</h2>
              <ChartContainer>
                <AvgWaitTimeChartComparison />
              </ChartContainer>
            </InnerDiv>
          </DivRow>
          <DivRow>
            <InnerDiv>
              <h2>Simulation of Traffic</h2>
              <SimContainer>
                <Simulator />
              </SimContainer>
            </InnerDiv>
          </DivRow>
        </OuterDiv>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  intersectionId: state.router.location.pathname.substring(
    state.router.location.pathname.lastIndexOf('/') + 1,
  ),
  intersectionName: state.intersection.intersection_name,
  error: state.intersection.error,
  user_id: state.authentication.user_id,
});

const mapDispatchToProps: DispatchProps = {
  getExistingIntersection,
  getDistricts,
};

export default connect(mapStateToProps, mapDispatchToProps)(CamView);

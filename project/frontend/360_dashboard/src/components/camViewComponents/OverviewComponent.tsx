import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { RootState } from '../../reducers/rootReducer';
import Box from '@material-ui/core/Box';
import SidebarComponent from './SidebarComponent'
import { SKEYE_WHITE, SKEYE_LIGHT_BLACK, SKEYE_BRIGHT_GREEN } from '../../css/custom';
import { getExistingCamera } from '../../contexts/camera';
import Simulator from './../../containers/simulator/Scene';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';

interface SimProps {
    tl_mode: number;
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
  width: 40vw;
  height: 20vw;
  margin: 1rem;
  background-color: #212121;
  display: flex;
  justify-content: center;
  justify-content: center;
  align-items: center;
`;

// Vertical flexbox styling
const VerticalFlexBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: space-around;
  align-items: space-around;
  align-content: stretch;
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
//   width: 100vw;
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
//   width: 10vw;
//   height: 10vw;
//   margin-left: 20rem;
  width: 10%;
  height: 10%;
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
    BoxLeft: {
        width: `18vw`,
        height: `20vw`,
        backgroundColor: SKEYE_LIGHT_BLACK,
        marginLeft: `-8.2vw`,
        marginTop: `2.5vw`,

    },
    BoxRight: {
        width: `18vw`,
        height: `20vw`,
        backgroundColor: SKEYE_LIGHT_BLACK,
        marginLeft: `2vw`,
        marginTop: `2.5vw`,

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
}

class OverviewComponent extends React.Component<StateProps & DispatchProps, {tlMode:number}> {
    // simComponentRef:any;
    // tlMode :number;
    

    constructor(props:any) {
        super(props);
        this.state = {
            tlMode: 0,
        }
        // this.simComponentRef = React.createRef();
        // this.tlMode = 0;
        this.onChangeTLMode = this.onChangeTLMode.bind(this);
    }

    onChangeTLMode(index:number) {
        this.setState({tlMode: index});

    }

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
                    <SidebarComponent onChangeTLMode={this.onChangeTLMode}></SidebarComponent>
                    <VerticalFlexBox>
                        <InnerDivVertical>
                            <text style={ skeyeStyles.Header }>Live Camera Feed</text>
                            <CamFeed src={`http://${camera_url}/cam`} alt="Loading..." />
                        </InnerDivVertical>
                        <InnerDivVertical>
                            <text style={ skeyeStyles.Header }>Default Traffic Light Setting</text>
                            <SimContainer>
                            <Simulator isSmartTL={false} tl_mode={this.state.tlMode}/>
                            </SimContainer>
                        </InnerDivVertical>
                    </VerticalFlexBox>
                    <VerticalFlexBox>
                        <InnerDivHorizon>
                            <div style={ skeyeStyles.BoxLeft }>
                                <InnerDivVertical>
                                    <text style={ skeyeStyles.BoxTextTitle }>Gas Consumption</text> 
                                    <br/>
                                    <text style={ skeyeStyles.BoxTextValue }>18</text>
                                    <br/>
                                    <text style={ skeyeStyles.BoxTextUnit }>Liters / Hour</text>
                                    <br/>
                                    <div>
                                        <ArrowDropDownIcon style={ skeyeStyles.GreenArrow }></ArrowDropDownIcon>
                                        <text style={ skeyeStyles.BoxTextPercentage }>8,88%</text>
                                    </div>
                                    <br/>
                                    <text style={ skeyeStyles.BoxTextUpdated }>Last updated: 1 day ago</text>
                                </InnerDivVertical>
                            </div>
                            <div style={ skeyeStyles.BoxRight }>
                                <InnerDivVertical>
                                    <text style={ skeyeStyles.BoxTextTitle }>Average Wait Time</text> 
                                    <br/>
                                    <text style={ skeyeStyles.BoxTextValue }>23.2</text>
                                    <br/>
                                    <text style={ skeyeStyles.BoxTextUnit }>Seconds</text>
                                    <br/>
                                    <div>
                                        <ArrowDropDownIcon style={ skeyeStyles.GreenArrow }></ArrowDropDownIcon>
                                        <text style={ skeyeStyles.BoxTextPercentage }>28,88%</text>
                                    </div>
                                    <br/>
                                    <text style={ skeyeStyles.BoxTextUpdated }>Last updated: 5 min ago</text>
                                </InnerDivVertical>
                            </div>
                        </InnerDivHorizon>
                        <InnerDivVertical>
                            <text style={ skeyeStyles.Header }>Optimized Traffic Light Setting</text>
                            <SimContainer>
                            <Simulator isSmartTL tl_mode={this.state.tlMode}/>
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


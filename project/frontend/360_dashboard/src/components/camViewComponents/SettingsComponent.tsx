import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { purple, green } from '@material-ui/core/colors';
import { RootState } from '../../reducers/rootReducer';
import SidebarComponent from './SidebarComponent'
import Simulator from './../../containers/simulator/Scene';
import { SKEYE_WHITE, SKEYE_GREEN, SKEYE_GREY } from '../../css/custom';
import { makeStyles, Theme, withStyles, Switch, FormGroup, FormControlLabel } from '@material-ui/core';

// Generic flexboxes styling
const HorizontalFlexBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: left;
  align-items: left;
  align-content: stretch;
  padding: 0px;
`;

// Generic flexboxes styling
const BoxMain = styled.div`
//   display: flex;
//   flex-direction: column;
//   flex-wrap: nowrap;
//   justify-content: space-around;
//   align-items: space-around;
//   align-content: stretch;
//   padding: 0px;
//   width: 20vw;
    top: 0px;
    left: 0px;
`;

const BoxHorizontal = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: 10vw;
`;

// Generic flexboxes styling
const BoxSettings = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: left;
  align-items: left;
  align-content: stretch;
  padding: 0px;
  margin-top: 2vw;
`;

const GreenSwitch = withStyles({
    switchBase: {
      color: '#64ffda',
      '&$checked': {
        color: SKEYE_GREEN,
      },
      '&$checked + $track': {
        backgroundColor: SKEYE_GREEN,
      },
    },
    checked: {},
    track: {
        backgroundColor: SKEYE_GREY,
    },
  })(Switch);

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
    SettingsHeader: {
        color: SKEYE_WHITE,
        fontSize: 20,
        fontWeight: 900,
        marginBottom: 50,
    },
    Message: {
        color: SKEYE_WHITE,
        fontSize: 20,
        marginTop: 50,
        marginLeft: 50,
    },
    ControlLabel: {
        marginLeft: 60,
        marginBottom: 42,
    },
}

export default function SettingsComponent() {
    const [state, setState] = React.useState({
      checkedA: true,
      checkedB: false,
      checkedC: false,
      checkedD: false,
    });
  
    const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setState({ ...state, [name]: event.target.checked });
    };
    // eslint-disable-next-line consistent-return
    return (
        <div>
            <HorizontalFlexBox>
                <BoxMain>
                    <text style={ skeyeStyles.Title }>Settings for the simulators</text>
                    {/* <text style={ skeyeStyles.Message }>All your preferences for the simulators will be saved here</text> */}
                </BoxMain>
                <BoxHorizontal>
                    <BoxSettings>
                        <text style={ skeyeStyles.SettingsHeader }>Enable video feed</text>
                        <text style={ skeyeStyles.SettingsHeader }>Enable sampling of video feed</text>
                        <text style={ skeyeStyles.SettingsHeader }>Show section areas</text>
                        <text style={ skeyeStyles.SettingsHeader }>Show video background</text>
                    </BoxSettings>
                    <FormGroup>
                        <BoxSettings>
                        <FormControlLabel
                            control={
                            <GreenSwitch
                                checked={state.checkedA}
                                onChange={handleChange('checkedA')}
                                value="checkedA"
                            />
                            }
                            label=""
                            style={ skeyeStyles.ControlLabel }
                        />
                        <FormControlLabel
                            control={
                            <GreenSwitch
                                checked={state.checkedB}
                                onChange={handleChange('checkedB')}
                                value="checkedB"
                            />
                            }
                            label=""
                            style={ skeyeStyles.ControlLabel }
                        />
                        <FormControlLabel
                            control={
                            <GreenSwitch
                                checked={state.checkedC}
                                onChange={handleChange('checkedC')}
                                value="checkedC"
                            />
                            }
                            label=""
                            style={ skeyeStyles.ControlLabel }
                        />
                        <FormControlLabel
                            control={
                            <GreenSwitch
                                checked={state.checkedD}
                                onChange={handleChange('checkedD')}
                                value="checkedD"
                            />
                            }
                            label=""
                            style={ skeyeStyles.ControlLabel }
                        />
                        </BoxSettings>
                    </FormGroup>    
                </BoxHorizontal>
            </HorizontalFlexBox>
        </div>
    );
}


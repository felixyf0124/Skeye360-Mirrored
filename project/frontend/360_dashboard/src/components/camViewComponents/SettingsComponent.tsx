import React from 'react';
import styled from 'styled-components';
import {
  withStyles, Switch, FormGroup, FormControlLabel,
} from '@material-ui/core';
import { SKEYE_WHITE, SKEYE_GREEN, SKEYE_GREY } from '../../css/custom';

// Horizontal flexbox styling
const HorizontalFlexBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: left;
  align-items: left;
  align-content: stretch;
  padding: 0px;
`;

// Title flexbox styling
const BoxMain = styled.div`
    top: 0px;
    left: 0px;
`;

// Horizontal box for the entire component
const BoxHorizontal = styled.div`
    display: flex;
    flex-direction: row;
    margin-left: 10vw;
`;

// Box for settings and toggles
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

// Custom switch
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
};

export default function SettingsComponent() {
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: false,
    checkedC: false,
    checkedD: false,
  });

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [name]: event.target.checked });
  };
    // eslint-disable-next-line consistent-return
  return (
    <div>
      <HorizontalFlexBox>
        <BoxMain>
          <text style={skeyeStyles.Title}>Settings for the simulators</text>
        </BoxMain>
        <BoxHorizontal>
          <BoxSettings>
            <text style={skeyeStyles.SettingsHeader}>Enable video feed</text>
            <text style={skeyeStyles.SettingsHeader}>Enable sampling of video feed</text>
            <text style={skeyeStyles.SettingsHeader}>Show section areas</text>
            <text style={skeyeStyles.SettingsHeader}>Show video background</text>
          </BoxSettings>
          <FormGroup>
            <BoxSettings>
              <FormControlLabel
                control={(
                  <GreenSwitch
                    checked={state.checkedA}
                    onChange={handleChange('checkedA')}
                    value="checkedA"
                  />
                          )}
                label=""
                style={skeyeStyles.ControlLabel}
              />
              <FormControlLabel
                control={(
                  <GreenSwitch
                    checked={state.checkedB}
                    onChange={handleChange('checkedB')}
                    value="checkedB"
                  />
                          )}
                label=""
                style={skeyeStyles.ControlLabel}
              />
              <FormControlLabel
                control={(
                  <GreenSwitch
                    checked={state.checkedC}
                    onChange={handleChange('checkedC')}
                    value="checkedC"
                  />
                          )}
                label=""
                style={skeyeStyles.ControlLabel}
              />
              <FormControlLabel
                control={(
                  <GreenSwitch
                    checked={state.checkedD}
                    onChange={handleChange('checkedD')}
                    value="checkedD"
                  />
                          )}
                label=""
                style={skeyeStyles.ControlLabel}
              />
            </BoxSettings>
          </FormGroup>
        </BoxHorizontal>
      </HorizontalFlexBox>
    </div>
  );
}

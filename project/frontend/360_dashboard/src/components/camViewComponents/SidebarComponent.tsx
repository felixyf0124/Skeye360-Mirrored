// References for the collapsable component: https://material-ui.com/components/expansion-panels/#SimpleExpansionPanel.tsx

import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import TrendingUpIcon from '@material-ui/icons/TrendingUp';
import DirectionsWalkIcon from '@material-ui/icons/DirectionsWalk';
import Button from '@material-ui/core/Button';
import ReportIcon from '@material-ui/icons/Report';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PowerSettingsNewIcon from '@material-ui/icons/PowerSettingsNew';
import { ExpansionPanel, ExpansionPanelSummary, ExpansionPanelDetails } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import styled from 'styled-components';
import {
  SKEYE_WHITE, SKEYE_GREY,
  SKEYE_LIGHT_DARK_GREY, SKEYE_RED,
  SKEYE_LIGHT_BLACK, SKEYE_GREEN,
  SKEYE_DARK_GREY,
  SKEYE_BRIGHT_GREEN,
  SKEYE_YELLOW,
} from '../../css/custom';

interface SimProps {
  isLiveFeed: boolean;
  tlMode: number;
  onChangeTLMode: any;
  onClickTLStop: any;
  tlStop: boolean;
  onClickSimuStart: any;
  tlCombStates: Array<{
    direction: string;
    state: string;
    state2: string;
    countDown: string;
    countDown2: string;
    totalTime: string; // G+Y
    totalTime2: string; // G+Y
  }>;
  getTLstates: any;
  loopCountDown: number;
  loopCountDown2: number;
}

// Horizontal box for the entire component
const DivVertical = styled.div`
    display: flex;
    flex-direction: column;
`;

const width = 10;

// Create styles for the sidebar
const useStyles = makeStyles(() => createStyles({
  root: {
    '&$selected': {
      backgroundColor: SKEYE_LIGHT_DARK_GREY,
    },
  },
  sidebar: {
    backgroundColor: SKEYE_LIGHT_BLACK,
    width: `${width}vw`,
    minHeight: '22vw',
    maxHeight: '47vw',
  },
  content: {
    textAlign: 'left',
    marginLeft: 10,
    marginTop: 10,
    paddingTop: 8,
    overflowY: 'scroll',
    maxHeight: '37.5vw',
  },
  titleBox: {
    backgroundColor: SKEYE_LIGHT_BLACK,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
    paddingTop: 4,
    paddingBottom: 4,
  },
  dividerWhite: {
    backgroundColor: SKEYE_WHITE,
    marginRight: 10,
    marginTop: 10,
    // marginBottom: 10,
  },
  dividerGrey: {
    backgroundColor: SKEYE_GREY,
    marginRight: 10,
    marginTop: 2,
    marginBottom: 2,
  },
  listItem: {
    marginTop: -8,
    marginBottom: -8,
  },
  selected: {
  },

  tlTable: {
    marginTop: 0,
    marginBottom: 0,
    display: 'block',
  },

  tlTRow: {
    margin: 'auto',
    display: 'table-row',
  },
  '@global': {
    '*::-webkit-scrollbar': {
      width: '0.3em',
    },
    '*::-webkit-scrollbar-track': {
      '-webkit-box-shadow': 'inset 0 0 6px rgba(0,0,0,0.5)',
      backgroundColor: SKEYE_DARK_GREY,
      borderRadius: '0.5em',
    },
    '*::-webkit-scrollbar-thumb': {
      backgroundColor: SKEYE_GREEN,
      borderRadius: '10px',
    },
  },
}));

// Personalized styles based on our UI
const skeyeStyles = {
  ListItemStyle: {
    color: SKEYE_WHITE,
    fontSize: '0.1em',
  },
  IconStyle: {
    color: SKEYE_WHITE,
  },
  Title: {
    color: SKEYE_WHITE,
    fontSize: 16,
    marginLeft: 4,
  },
  Header: {
    color: SKEYE_GREY,
    fontSize: 15,
  },
  ButtonStyle: {
    backgroundColor: SKEYE_LIGHT_DARK_GREY,
    color: SKEYE_WHITE,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 8,
    marginRight: 8,
    width: `${width - 2}vw`,
  },
  EmergencyButton: {
    backgroundColor: SKEYE_LIGHT_DARK_GREY,
    color: SKEYE_RED,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 8,
    width: `${width - 2}vw`,
  },
  ResumeButton: {
    backgroundColor: SKEYE_LIGHT_DARK_GREY,
    color: SKEYE_YELLOW,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 8,
    width: `${width - 2}vw`,
  },
  StopIcon: {
    marginRight: 10,
  },
  Expansion: {
    backgroundColor: SKEYE_LIGHT_BLACK,
    marginLeft: '-1vw',
  },
  ExpansionDetails: {
    marginLeft: '-0.25vw',
  },
  SimMenuIcon: {
    color: SKEYE_BRIGHT_GREEN,
    marginRight: 10,
  },
  SettingsMenuIcon: {
    color: SKEYE_WHITE,
    marginRight: 10,
  },
  TextMessage: {
    color: SKEYE_WHITE,
    fontSize: 12,
  },
  TrafficLightComp: {
    display: 'table-row-group',
    // marginTop: '-10vh',
  },
};

// Creates and returns a component for the sidebar that will be used in the simulator
const SidebarComponent = (props: SimProps | any): JSX.Element => {
  const {
    isLiveFeed, tlMode, onChangeTLMode, onClickTLStop, onClickSimuStart,
    tlCombStates, keyValue, loopCountDown, loopCountDown2, tlStop,
  } = props;
  const classes = useStyles();


  const [selectedIndex, setSelectedIndex] = React.useState(tlMode);
  // const [emergencyToggle, setEmergencyToggle] = React.useState(false);
  const [emergencyBtnCol, setEmergencyBtnCol] = React.useState(
    tlStop ? SKEYE_GREEN : SKEYE_RED,
  );

  const eBtnStyle = {
    backgroundColor: SKEYE_LIGHT_DARK_GREY,
    color: emergencyBtnCol,
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 8,
    width: `${width - 2}vw`,
  };

  const stopBtn = (): JSX.Element => (
    <div>
      {' '}
      <ReportIcon style={skeyeStyles.StopIcon} />
      {' '}
      STOP
    </div>
  );

  const resumeBtn = (): JSX.Element => (
    <div>
      {' '}
      <PlayCircleFilledIcon style={skeyeStyles.StopIcon} />
      {' '}
      RESUME
    </div>
  );

  const [emergencyButton, setEmergencyButton] = React.useState(
    tlStop ? resumeBtn() : stopBtn(),
  );

  const onClickEmergency = (): void => {
    onClickTLStop();
    if (tlStop) {
      // setEmergencyToggle(false);
      setEmergencyBtnCol(SKEYE_RED);
      setEmergencyButton(
        stopBtn(),
      );
    } else {
      // setEmergencyToggle(true);
      setEmergencyBtnCol(SKEYE_GREEN);
      setEmergencyButton(
        resumeBtn(),
      );
    }
  };

  const directions = ['North & South', 'East & West - Left Turn', 'East & West', 'East & West - Right Turn', 'South - Right Turn'];

  // OnClick it will the variable to the selected item (Arima, Pedestrians or Real-Time)
  const onClickListItem = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ): void => {
    setSelectedIndex(index);
    onChangeTLMode(index);
  };

  const tlAtDiv = (index: number, combinedTLState: Array<{
    direction: string;
    state: string;
    state2: string;
    countDown: string;
    countDown2: string;
    totalTime: string; // G+Y
    totalTime2: string; // G+Y
  }>): JSX.Element => {
    const tlDataHeader = {
      color: SKEYE_WHITE,
      fontSize: '0.9em',
      textDecorationLine: 'underline',
      margin: 'auto',
      display: 'table-cell',
    };
    const tlData = {
      color: SKEYE_WHITE,
      fontSize: '0.8em',
      margin: 'auto',
      display: 'table-cell',
    };
    const tlDataCol = {
      color: SKEYE_WHITE,
      fontSize: '0.8em',
      margin: 'auto',
      display: 'table-cell',
    };
    const tlDataCol2 = {
      color: SKEYE_WHITE,
      fontSize: '0.8em',
      margin: 'auto',
      display: 'table-cell',
    };
    if (combinedTLState.length > 0) {
      if (combinedTLState[index].state === 'red') {
        tlDataCol.color = '#FF0000';
      } else if (combinedTLState[index].state === 'green') {
        tlDataCol.color = '#00FF00';
      } else if (combinedTLState[index].state === 'yellow') {
        tlDataCol.color = '#f5c842';
      }

      if (combinedTLState[index].state2 === 'red') {
        tlDataCol2.color = '#FF0000';
      } else if (combinedTLState[index].state2 === 'green') {
        tlDataCol2.color = '#00FF00';
      } else if (combinedTLState[index].state2 === 'yellow') {
        tlDataCol2.color = '#f5c842';
      }

      return (
        <div>
          <tr className={classes.tlTRow}>
            <th style={tlDataHeader}>Direction:</th>
          </tr>
          <tr className={classes.tlTRow}>
            <td style={tlData} colSpan={4}>
              {((): any => {
                switch (combinedTLState[index].direction) {
                  case 's<=>n,s->w,s->s,n->e,n->w': return directions[0];
                  case 'e->e,e->s,w->w,w->n': return directions[1];
                  case 'e<=>w': return directions[2];
                  case 'e->n,w->s': return directions[3];
                  case 's->e': return directions[4];
                  default: return null;
                }
              })()}
            </td>
          </tr>
          <tr className={classes.tlTRow} style={{ textAlign: 'center' }}>
            <td style={tlData}>Type</td>
            {/* <td style={tlData}>State</td> */}
            <td style={tlData}>State</td>
            <td style={tlData}>Time</td>
          </tr>
          <tr className={classes.tlTRow} style={{ textAlign: 'center' }}>
            <td style={tlData}>Default</td>
            {/* <td style={tlDataCol}>{tlCombState.state}</td> */}
            <td style={tlDataCol}>⬤</td>
            <td style={tlData}>{combinedTLState[index].totalTime}</td>
          </tr>
          <tr className={classes.tlTRow} style={{ textAlign: 'center' }}>
            <td style={tlData}>Optimized</td>
            {/* <td style={tlDataCol2}>{tlCombState.state2}</td> */}
            <td style={tlDataCol2}>⬤</td>
            <td style={tlData}>{combinedTLState[index].totalTime2}</td>
          </tr>
          <tr>
            <td colSpan={4}>
              <Divider classes={{ root: classes.dividerGrey }} />
            </td>
          </tr>
        </div>
      );
    }
    return (<div />);
  };


  // traffic light comparison layout 1
  // const tlStateComponent1 = (): JSX.Element => (
  //   <div>
  //     <table style={{ display: 'block' }}>
  //       <tbody className={classes.tlTable}>
  //         {tlDiv}
  //       </tbody>
  //     </table>
  //   </div>
  // );

  // traffic light comparison layout 2
  const tlStateComponent2 = (): JSX.Element => {
    const tlData = {
      color: SKEYE_WHITE,
      fontSize: '0.8em',
      margin: 'auto',
      display: 'table-cell',
    };

    return (
      <div>
        <Divider classes={{ root: classes.dividerGrey }} />
        <table style={{ display: 'block' }}>
          <tbody className={classes.tlTable}>
            <tr className={classes.tlTRow}>
              <td style={tlData} colSpan={3}>
                Loop countdown:
              </td>
            </tr>
            <tr className={classes.tlTRow}>
              <td style={tlData} colSpan={2}>
                Default
              </td>
              <td style={tlData}>{loopCountDown}</td>
            </tr>
            <tr className={classes.tlTRow}>
              <td style={tlData} colSpan={2}>
                Optimized
              </td>
              <td style={tlData}>{loopCountDown2}</td>
            </tr>
            <Divider classes={{ root: classes.dividerGrey }} />
            {tlAtDiv(0, tlCombStates)}
            {tlAtDiv(1, tlCombStates)}
            {tlAtDiv(2, tlCombStates)}
          </tbody>
        </table>
      </div>
    );
  };

  const tlDoCompare = (isLiveFeed: boolean): JSX.Element => {
    if (isLiveFeed) {
      return (<div />);
    }
    return (
      <div>
        {/* For the Traffic Light Comparison */}
        <ExpansionPanel style={skeyeStyles.Expansion}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon style={skeyeStyles.IconStyle} />}
            aria-controls="panel2a-content"
            id="panel2a-header"
          >
            <text style={skeyeStyles.Header}> Traffic Light Comparison </text>
            <Divider classes={{ root: classes.dividerGrey }} />
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={skeyeStyles.ExpansionDetails}>
            {tlStateComponent2()}
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <Divider classes={{ root: classes.dividerWhite }} />

        {/* For the simulator options */}
        <ExpansionPanel style={skeyeStyles.Expansion}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon style={skeyeStyles.IconStyle} />}
            aria-controls="panel3a-content"
            id="panel3a-header"
          >
            <text style={skeyeStyles.Header}> Simulator </text>
            <Divider classes={{ root: classes.dividerGrey }} />
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={skeyeStyles.ExpansionDetails}>
            <DivVertical>
              <text style={skeyeStyles.TextMessage}>
                Starts generating sample vehicles.
              </text>
              <Button variant="contained" style={skeyeStyles.ButtonStyle} onClick={onClickSimuStart}>
                <PowerSettingsNewIcon style={skeyeStyles.SimMenuIcon} />
                START
              </Button>
              {/* <Button variant="contained" style={skeyeStyles.ButtonStyle}>
                <SettingsIcon style={skeyeStyles.SettingsMenuIcon}/>
                SETTINGS
              </Button> */}
            </DivVertical>
          </ExpansionPanelDetails>
        </ExpansionPanel>

        <Divider classes={{ root: classes.dividerWhite }} />

        {/* For the emergency option */}
        <ExpansionPanel style={skeyeStyles.Expansion}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon style={skeyeStyles.IconStyle} />}
            aria-controls="panel4a-content"
            id="panel4a-header"
          >
            <text style={skeyeStyles.Header}> Emergency Mode </text>
            <Divider
              classes={{ root: classes.dividerGrey }}
            />
          </ExpansionPanelSummary>
          <ExpansionPanelDetails style={skeyeStyles.ExpansionDetails}>
            <DivVertical>
              <text style={skeyeStyles.TextMessage}>
                To change all traffic lights to red for emergency operations
              </text>
              <Button
                variant="contained"
                style={eBtnStyle}
                onClick={onClickEmergency}
              >
                {emergencyButton}
              </Button>
            </DivVertical>
          </ExpansionPanelDetails>
        </ExpansionPanel>
        <Divider classes={{ root: classes.dividerWhite }} />

      </div>
    );
  };


  // Returns the UI for the sidebar
  return (
    <div className={classes.sidebar}>
      <div className={classes.content}>
        <div className={classes.titleBox}>
          <text style={skeyeStyles.Title}> Options for Simulator</text>
        </div>

        <Divider classes={{ root: classes.dividerWhite }} />

        {/* For the modes options */}
        {/* {console.log(keyPassed)} */}
        {keyValue === '1'
          ? (
            <ExpansionPanel style={skeyeStyles.Expansion}>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon style={skeyeStyles.IconStyle} />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <text style={skeyeStyles.Header}> Modes </text>
                <Divider classes={{ root: classes.dividerGrey }} />
              </ExpansionPanelSummary>
              <ExpansionPanelDetails style={skeyeStyles.ExpansionDetails}>
                <List>
                  <ListItem
                    button
                    selected={selectedIndex === 0}
                    classes={{ root: classes.root, selected: classes.selected }}
                    onClick={(event): void => onClickListItem(event, 0)}
                  >
                    <ListItemIcon style={skeyeStyles.IconStyle}>
                      <TrendingUpIcon />
                    </ListItemIcon>
                    <ListItemText style={skeyeStyles.ListItemStyle}>
                      Live Feed
                    </ListItemText>
                  </ListItem>

                  <ListItem
                    button
                    selected={selectedIndex === 1}
                    classes={{ root: classes.root, selected: classes.selected }}
                    onClick={(event): void => onClickListItem(event, 1)}
                  >
                    <ListItemIcon style={skeyeStyles.IconStyle}>
                      <DirectionsWalkIcon />
                    </ListItemIcon>
                    <ListItemText style={skeyeStyles.ListItemStyle}>
                      Pedestrians
                    </ListItemText>
                  </ListItem>

                  {/* <ListItem
                    button
                    selected={selectedIndex === 2}
                    classes={{ root: classes.root, selected: classes.selected }}
                    onClick={(event): void => onClickListItem(event, 2)}
                  >
                    <ListItemIcon style={skeyeStyles.IconStyle}>
                      <TrackChangesIcon />
                    </ListItemIcon>
                    <ListItemText style={skeyeStyles.ListItemStyle}>
                      Real-Time
                    </ListItemText>
                  </ListItem> */}
                </List>
              </ExpansionPanelDetails>
            </ExpansionPanel>
          )
          : null}

        {keyValue === '1'
          ? <Divider classes={{ root: classes.dividerWhite }} />
          : null}
        {tlDoCompare(isLiveFeed)}

      </div>
    </div>
  );
};

export default SidebarComponent;

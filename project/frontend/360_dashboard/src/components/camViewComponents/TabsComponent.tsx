// References for the tabs: https://material-ui.com/components/tabs/#simple-tabs
// References for the dialog: https://material-ui.com/components/dialogs/

import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
// import SettingsIcon from '@material-ui/icons/Settings';
import styled from 'styled-components';
import {
  FormControlLabel, Switch, withStyles, FormGroup,
} from '@material-ui/core';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import DataAnalyticsComponent from './DataAnalyticsComponent';
// import SimulatorComponent from './SimulatorComponent';
import SimulatorWithTabsComponent from './SimulatorWithTabsComponent';
import CameraComponent from './CameraComponent';
// import OverviewComponent from './OverviewComponent';
import LiveComponent from './LiveComponent';
import {
  SKEYE_GREY,
  SKEYE_DARK_GREY,
  SKEYE_LIGHT_DARK_GREY,
  SKEYE_WHITE,
  SKEYE_GREEN,
} from '../../css/custom';

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

// Used simple tabs example from the reference mentioned above
function TabPanel(props: TabPanelProps): JSX.Element {
  const {
    children, value, index, ...other
  } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={2}>{children}</Box>}
    </Typography>
  );
}

function props(index: any): any {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

// const BoxSettingsMenu = styled.div`
//   position: absolute;
//   right: 0;
//   background-color: SKEYE_LIGHT_DARK_GREY;
// `;

// Horizontal flexbox styling
const HorizontalFlexBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
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
  // margin-top: 2vw;
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

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: SKEYE_DARK_GREY,
    width: '98vw',
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: SKEYE_DARK_GREY,
    border: '2px {SKEYE_DARK_GREY}',
    borderRadius: '5px',
    boxShadow: theme.shadows[8],
    padding: theme.spacing(2, 4, 2),
  },
  SaveButton: {
    backgroundColor: SKEYE_GREEN,
  },
}));

// Custom styling
export const skeyeStyles = {
  TabBar: {
    backgroundColor: SKEYE_LIGHT_DARK_GREY,
  },
  TabOnly: {
    backgroundColor: SKEYE_DARK_GREY,
  },
  SettingsIcon: {
    color: SKEYE_WHITE,
    backgroundColor: SKEYE_LIGHT_DARK_GREY,
    borderColor: SKEYE_LIGHT_DARK_GREY,
    fontSize: 20,
    height: 50,
    width: 60,
  },
  SettingsBox: {
    color: SKEYE_LIGHT_DARK_GREY,
    backgroundColor: SKEYE_LIGHT_DARK_GREY,
  },
  Dialog: {
    color: SKEYE_LIGHT_DARK_GREY,
    backgroundColor: SKEYE_LIGHT_DARK_GREY,
  },
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
  Box: {
    marginTop: 60,
  },
};

const TabsComponents = (): JSX.Element => {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [state, setState] = React.useState({
    checkedA: true,
    checkedB: false,
    checkedC: false,
    checkedD: false,
    checkedE: false,
  });
  const [tlMode, setTlMode] = React.useState(0);

  const [tlStop, setTlStop] = React.useState(false);

  const [tlStates, setTlStates] = React.useState([
    {
      direction: 'Directions',
      state: 'State',
      countDown: 'CD',
      totalTime: 't(G+Y)', // G+Y
    },
  ]);
  const [tlStates2, setTlStates2] = React.useState([
    {
      direction: 'Directions',
      state: 'State',
      countDown: 'CD',
      totalTime: 't(G+Y)', // G+Y
    },
  ]);

  const [tlCombStates, setTLCombStates] = React.useState([
    {
      direction: '',
      state: '',
      state2: '',
      countDown: '',
      countDown2: '',
      totalTime: '', // G+Y
      totalTime2: '', // G+Y
    },
  ]);

  const onChangeTLMode = (index: number): any => {
    setTlMode(index);
  };

  const onClickTLStop = (): any => {
    setTlStop(!tlStop);
  };

  const onTLUpdate = (
    tls: Array<{
      direction: string;
      state: string;
      countDown: string;
      totalTime: string; // G+Y
    }>,
    isSmartTL: boolean,
  ): any => {
    if (isSmartTL) {
      setTlStates2(tls);
    } else {
      setTlStates(tls);
    }
    const newTLCombStates = new Array<{
      direction: string;
      state: string;
      state2: string;
      countDown: string;
      countDown2: string;
      totalTime: string; // G+Y
      totalTime2: string; // G+Y
    }>();
    if (tlStates.length === tlStates2.length) {
      for (let i = 0; i < tlStates.length; i += 1) {
        const tlCombState = {
          direction: tlStates[i].direction,
          state: tlStates[i].state,
          state2: tlStates2[i].state,
          countDown: tlStates[i].countDown,
          countDown2: tlStates2[i].countDown,
          totalTime: tlStates[i].totalTime, // G+Y
          totalTime2: tlStates2[i].totalTime, // G+Y
        };
        newTLCombStates.push(tlCombState);
      }
    }

    setTLCombStates(newTLCombStates);

    // console.log(tlCombStates);
  };


  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number): void => {
    setValue(newValue);
  };

  // const handleClickOpen = (): void => {
  //   setOpen(true);
  // };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [name]: event.target.checked });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" style={skeyeStyles.TabBar}>
        <Tabs
          value={value}
          onChange={handleChangeTab}
          TabIndicatorProps={{ style: { backgroundColor: 'white' } }}
        >
          <Tab label="Live Feed" {...props(0)} style={skeyeStyles.TabOnly} />
          <Tab label="Data Analytics" {...props(1)} style={skeyeStyles.TabOnly} />
          <Tab label="Camera" {...props(2)} style={skeyeStyles.TabOnly} />
          <Tab label="Simulator" {...props(3)} style={skeyeStyles.TabOnly} />

          {/* this is a setting button. Due to UI modificationm we no need them for our design */}
          {/* KEEP this in case the stakeholder needs it */}
          {/* value === 0 is for Live Feed tab and value === 3 is for Simulator tab */}
          {/* {value === 0
            ? (
              <BoxSettingsMenu style={skeyeStyles.SettingsBox}>
                <button type="button" style={skeyeStyles.SettingsIcon} onClick={handleClickOpen}>
                  <SettingsIcon />
                </button>
              </BoxSettingsMenu>
            )
            : null} */}

        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <LiveComponent
          toggles={state}
          tlMode={tlMode}
          onChangeTLMode={onChangeTLMode}
          tlStop={false}
          onClickTLStop={onClickTLStop}
          tlCombStates={tlCombStates}
          onTLUpdate={onTLUpdate}
          key="1"
        />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DataAnalyticsComponent />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CameraComponent />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <SimulatorWithTabsComponent
          toggles={state}
          tlMode={tlMode}
          onChangeTLMode={onChangeTLMode}
          tlStop={tlStop}
          onClickTLStop={onClickTLStop}
          tlCombStates={tlCombStates}
          onTLUpdate={onTLUpdate}
          key="2"
        />
      </TabPanel>

      {/* The following is the setting toggle form  */}
      {/* KEEP this in case the stakeholder need it */}
      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={open}>
          <div className={classes.paper}>
            <HorizontalFlexBox>
              <BoxMain>
                <text id="transition-modal-title" style={skeyeStyles.Title}>Settings for the simulators</text>
                {' '}
                {/* <text style={ skeyeStyles.Message }>
                All your preferences for the simulators will be saved here</text> */}
              </BoxMain>
              <BoxHorizontal style={skeyeStyles.Box}>
                <BoxSettings>
                  <text style={skeyeStyles.SettingsHeader}>Enable video feed</text>
                  <text style={skeyeStyles.SettingsHeader}>Enable sampling of video feed</text>
                  <text style={skeyeStyles.SettingsHeader}>Enable section car number box</text>
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
                    <FormControlLabel
                      control={(
                        <GreenSwitch
                          checked={state.checkedE}
                          onChange={handleChange('checkedE')}
                          value="checkedE"
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
        </Fade>
      </Modal>
    </div>
  );
};

export default TabsComponents;

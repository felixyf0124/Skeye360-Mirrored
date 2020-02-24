// References for the tabs: https://material-ui.com/components/tabs/#simple-tabs
// References for the dialog: https://material-ui.com/components/dialogs/

import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import SettingsIcon from '@material-ui/icons/Settings';
import styled from 'styled-components';
import {
  Button, FormControlLabel, Switch, withStyles, FormGroup,
} from '@material-ui/core';

import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import SaveIcon from '@material-ui/icons/Save';
import DataAnalyticsComponent from './DataAnalyticsComponent';
import SimulatorComponent from './SimulatorComponent';
import CameraComponent from './CameraComponent';
import OverviewComponent from './OverviewComponent';
import {
  SKEYE_GREY, SKEYE_DARK_GREY, SKEYE_LIGHT_DARK_GREY, SKEYE_WHITE, SKEYE_GREEN,
} from '../../css/custom';

interface SimProps {
  tl_mode: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

// Used simple tabs example from the reference mentioned above
function TabPanel(props: TabPanelProps) {
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

function props(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const BoxSettingsMenu = styled.div`
  position: absolute;
  right: 0;
  background-color: SKEYE_LIGHT_DARK_GREY;
`;

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
    margin-left: 5vw;
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
    width: '94vw',
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
const skeyeStyles = {
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

  const onChangeTLMode = (index: number): void => {
    setTlMode(index);
  };

  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number): void => {
    setValue(newValue);
  };

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [name]: event.target.checked });
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" style={skeyeStyles.TabBar}>
        <Tabs value={value} onChange={handleChangeTab} TabIndicatorProps={{ style: { backgroundColor: 'white' } }}>
          <Tab label="Overview" {...props(0)} style={skeyeStyles.TabOnly} />
          <Tab label="Data Analytics" {...props(1)} style={skeyeStyles.TabOnly} />
          <Tab label="Camera" {...props(2)} style={skeyeStyles.TabOnly} />
          <Tab label="Simulator" {...props(3)} style={skeyeStyles.TabOnly} />

          <BoxSettingsMenu style={skeyeStyles.SettingsBox}>
            <button type="button" style={skeyeStyles.SettingsIcon} onClick={handleClickOpen}>
              <SettingsIcon />
            </button>
          </BoxSettingsMenu>
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <OverviewComponent toggles={state} tlMode={tlMode} onChangeTLMode={onChangeTLMode} key="1" />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <DataAnalyticsComponent />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CameraComponent />
      </TabPanel>
      <TabPanel value={value} index={3}>
        <SimulatorComponent toggles={state} tlMode={tlMode} onChangeTLMode={onChangeTLMode} key="2" />
      </TabPanel>

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
                {/* <text style={ skeyeStyles.Message }>
                All your preferences for the simulators will be saved here</text> */}
              </BoxMain>
              <BoxHorizontal>
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
                    <Button
                      variant="contained"
                      color="primary"
                      size="large"
                      className={classes.SaveButton}
                      startIcon={<SaveIcon />}
                    >
                      Save
                    </Button>
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

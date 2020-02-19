//References for the tabs: https://material-ui.com/components/tabs/#simple-tabs

import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import { SKEYE_GREY, SKEYE_DARK_GREY, SKEYE_LIGHT_DARK_GREY } from '../../css/custom';
import OverviewComponent from './OverviewComponent';
import CameraComponent from './CameraComponent';
import SimulatorComponent from './SimulatorComponent';


interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

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

function a11yProps(index: any) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const width = 88;

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    // flexGrow: 1,
    backgroundColor: SKEYE_DARK_GREY,
    width: `${width}vw`,
  },
}));

const skeyeStyles = {
    TabBar: {
        backgroundColor: SKEYE_LIGHT_DARK_GREY,
    },
    TabOnly: {
        backgroundColor: SKEYE_DARK_GREY,
    },
}


export default function TabsComponents() {
  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

//   const getStyle = (isActive: any) => {
//       if(isActive) {
//           return skeyeStyles.Active
//       } else {
//           return skeyeStyles.NonActive
//       }
//     // return isActive ? skeyeStyles.Active : skeyeStyles.NonActive
//   }

  return (
    <div className={classes.root}>
      <AppBar position="static" style={skeyeStyles.TabBar}>
        <Tabs value={value} onChange={handleChange} TabIndicatorProps={{style: {backgroundColor: "white"}}}>
          <Tab label="Overview" {...a11yProps(0)} style={skeyeStyles.TabOnly} /> 
          <Tab label="Data Analytics" {...a11yProps(1)} style={skeyeStyles.TabOnly} />
          <Tab label="Camera" {...a11yProps(2)} style={skeyeStyles.TabOnly} />
          <Tab label="Simulator" {...a11yProps(3)} style={skeyeStyles.TabOnly} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <OverviewComponent></OverviewComponent>>
      </TabPanel>
      <TabPanel value={value} index={1}>
        Item Two
      </TabPanel>
      <TabPanel value={value} index={2}>
        <CameraComponent></CameraComponent>
      </TabPanel>
      <TabPanel value={value} index={3}>
        <SimulatorComponent></SimulatorComponent>
      </TabPanel>
    </div>
  );
}

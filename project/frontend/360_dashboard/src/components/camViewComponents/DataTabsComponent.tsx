import React from 'react';
import styled from 'styled-components';
import {
  makeStyles, Typography, Box,
} from '@material-ui/core';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import BarChartDirections from '../charts/BarChartDirections';
import {
  SKEYE_WHITE, SKEYE_DARK_GREY, SKEYE_LIGHT_DARK_GREY, SKEYE_LIGHT_BLACK, SKEYE_BRIGHT_GREEN,
} from '../../css/custom';

interface Props {
  chartID: string;
  ttlPassed: number;
  directionData: Array<{ direction: string; passedNum: number }>;
  waitingTime: number;
}

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

function panel(index: any): any {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}

const VerticalBlock = styled.div`
  display: flex;
  flex-direction:column;
`;

// Single Container Horizontal
const InnerDivHorizon = styled.div`
  display: flex;
  flex-direction: row;
  color: white;
  margin-left: 1vw;
`;

const DataBox = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 20vw;
    color: white;
`;

const BarChartContainer = styled.div`
  width: 23vw;
  position: relative;
`;

const useStyles = makeStyles(() => ({
  root: {
    flexGrow: 1,
    //   backgroundColor: SKEYE_DARK_GREY,
    backgroundColor: SKEYE_LIGHT_BLACK,
    width: '48vw',
    height: '38vh',
    marginLeft: '7vw',
    //   marginBottom: '1vh',
  },
}));

// Custom styling
const skeyeStyles = {
  Header: {
    color: SKEYE_WHITE,
    fontSize: 20,
    marginBottom: 4,
    fontWeight: 600,
    height: 30,
  },
  Data: {
    color: SKEYE_WHITE,
    fontSize: 30,
    marginTop: 40,
    marginBottom: 4,
    fontWeight: 600,
    height: 35,
  },
  Metric: {
    color: SKEYE_WHITE,
    fontSize: 20,
    marginBottom: 20,
    fontWeight: 600,
    height: 35,
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
  TabBar: {
    backgroundColor: SKEYE_LIGHT_DARK_GREY,
  },
  TabOnly: {
    backgroundColor: SKEYE_DARK_GREY,
  },
};

const DataTabsComponent = (props: any): JSX.Element => {
  const { chartID, ttlPassedCars, passedVehicles, waitingTime } = props;

  const classes = useStyles();
  const [value, setValue] = React.useState(0);
  const handleChangeTab = (event: React.ChangeEvent<{}>, newValue: number): void => {
    setValue(newValue);
  };

  const onFLoatRound = (num: number, digits: number): number => {
    let tens = 1;
    for (let i = 0; i < digits; i += 1) {
      tens *= 10;
    }
    const rounded = Math.round(num * tens) / tens;
    return rounded;
  };

  return (

    <div className={classes.root}>
      <AppBar position="static" style={skeyeStyles.TabBar}>
        <Tabs
          value={value}
          onChange={handleChangeTab}
          TabIndicatorProps={{ style: { backgroundColor: 'white' } }}
        >
          <Tab label="Number of cars" {...panel(0)} style={skeyeStyles.TabOnly} />
          <Tab label="Analysis" {...panel(1)} style={skeyeStyles.TabOnly} />

        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <div>
          <InnerDivHorizon>
            <VerticalBlock>
              <div style={{ marginTop: '6vh', marginRight: '3vh' }}>
                <DataBox>
                  <text style={skeyeStyles.Header}>Total Number Of Car Passed</text>
                  <text style={skeyeStyles.Data}>{ttlPassedCars}</text>
                </DataBox>
              </div>
            </VerticalBlock>
            <VerticalBlock>
              <BarChartContainer>
                {/* TO DO: CHANGE TO REAL DATA */}
                <BarChartDirections
                  // chartID="barChart-default"
                  chartID={chartID}
                  title="Number Of Car Passed Per Direction"
                  categories={['From North', 'From East', 'From South', 'From West']}
                  directionData={passedVehicles}
                />
              </BarChartContainer>
            </VerticalBlock>
          </InnerDivHorizon>
        </div>
      </TabPanel>
      <TabPanel value={value} index={1}>
        <div>
          <InnerDivHorizon>
            <VerticalBlock>
              <div style={{ marginRight: '3vh' }}>
                <DataBox>
                  <text style={skeyeStyles.Header}>Gas Consumption</text>
                  {/* TO DO: CHANGE TO REAL DATA */}
                  <text style={skeyeStyles.Data}>62</text>
                  <text style={skeyeStyles.Metric}>Gallons/Hour</text>
                  {/* TO DO: CHANGE TO REAL DATA */}
                  <text style={skeyeStyles.BoxTextUpdated}>Last updated: 5 min ago</text>
                </DataBox>
              </div>
            </VerticalBlock>
            <VerticalBlock>
              <div>
                <DataBox>
                  <text style={skeyeStyles.Header}>Average Wait Time (All Directions)</text>
                  {/* TO DO: CHANGE TO REAL DATA */}
                  <text style={skeyeStyles.Data}>
                    {onFLoatRound(waitingTime / ttlPassedCars, 2)}
                  </text>
                  <text style={skeyeStyles.Metric}>Seconds</text>
                  {/* TO DO: CHANGE TO REAL DATA */}
                  <text style={skeyeStyles.BoxTextUpdated}>Last updated: 5 min ago</text>
                </DataBox>
              </div>
            </VerticalBlock>
          </InnerDivHorizon>
        </div>
      </TabPanel>
    </div>

  );
};
export default DataTabsComponent;

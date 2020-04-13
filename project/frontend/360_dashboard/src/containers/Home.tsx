/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { makeStyles, Theme } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import SideDrawer from '../components/SideDrawer';
import IntersectionTable from '../components/IntersectionTable';
import { RootState } from '../reducers/rootReducer';
import { setDistrictCoord, SetCoordAction } from '../contexts/app';
import { isStaff } from '../contexts/authentication';
import {
  STATE as districtState,
  GetDistrictsAction,
  getDistricts,
  resetDistricts,
  ResetDistrictAction,
} from '../contexts/districts';
import { deleteExistingIntersection, DeleteIntersectionAction } from '../contexts/intersection';
import { logClick, LogAction } from '../contexts/logClicks';
import TrafficNews from '../components/TrafficNews';
import GoogleMap from '../components/GoogleMap';
import { LOW_RES, MOBILE_DEVICE_MAX_WIDTH, SKEYE_DARK_GREY } from '../css/custom';
import AddIntersection from './AddIntersection';
import { getUsers, STATE as userState, GetUsersAction } from '../contexts/users';
import { skeyeStyles } from '../components/camViewComponents/TabsComponent';

// Content Container
const Content = styled.div`
  display: flex;
  margin-top: 5rem;
  overflow-y: hidden;
  overflow-x: hidden;
  @media only screen and (min-width: ${MOBILE_DEVICE_MAX_WIDTH}px) {
    & {
      overflow-y: hidden;
    }
  }
`;

// Generic flexboxes styling
const ContentFlexBox = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: nowrap;
  justify-content: space-between;
  align-items: space-around;
  align-content: stretch;

  @media only screen and (max-width: ${LOW_RES}px) {
    & {
      flex-direction: column;
      overflow-x: hidden;
    }
  }
`;

const LeftContentFlexBox = styled.div`
  display: flex;
  flex-direction: column;
  flex-wrap: nowrap;
  justify-content: flex-start;
  align-items: space-around;
  align-content: stretch;
  @media only screen and (max-width: ${LOW_RES}px) {
    & {
      flex-direction: column;
      overflow-x: hidden;
    }
  }
`;

const TableDiv = styled.div`
  margin-top: 1rem;
  width: 50vw;
  @media only screen and (max-width: ${LOW_RES}px) {
    & {
      width: 100vw;
    }
  }
`;

const TrafficDiv = styled.div`
  width: 45vw;
  height: 78vh;
  @media only screen and (max-width: ${LOW_RES}px) {
    & {
      width: 80vw;
    }
  }
`;

const Map = styled.div`
  width: 45vw;
  height: 78vh;
  @media only screen and (max-width: ${LOW_RES}px) {
    & {
      width: 80vw;
    }
  }
`;

const AddButton = styled.div`
  float: right;
  margin: 1rem;
`;

const Loader = styled.div`
  margin-top: 4rem;
  text-align: center;
`;

interface StateProps {
  appZoom: number;
  currentDistrict: string;
  districtLat: number;
  districtLng: number;
  districts: districtState;
  defaultDistrictLat: number;
  defaultDistrictLng: number;
  isStaff: boolean;
  selectedIntersection: string;
  users: userState;
  user_id: number;
}

interface DispatchProps {
  deleteExistingIntersection: (id: string) => DeleteIntersectionAction;
  getDistricts(): GetDistrictsAction;
  getUsers(): GetUsersAction;
  resetDistricts(): ResetDistrictAction;
  logClick: (log_message: string, user_id: number) => LogAction;
  setDistrictCoord: (name: string, lat: number, lng: number, zoom: number) => SetCoordAction;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: any;
  value: any;
}

// START OF TAB FUNCTIONS for HOME
// More info: https://material-ui.com/components/tabs/#tabs
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
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

function a11yProps(index: any): any {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
// END OF TAB FUNCTIONS for HOME

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const useStyles = makeStyles((theme: Theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: SKEYE_DARK_GREY,
    margin: '1rem',
  },
}));

const Home = (props: StateProps & DispatchProps): JSX.Element => {
  const {
    districts,
    districtLat,
    districtLng,
    defaultDistrictLat,
    defaultDistrictLng,
    isStaff,
    users,
    user_id,
    selectedIntersection,
    getDistricts,
    getUsers,
    currentDistrict,
  } = props;

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  useEffect(() => {
    getDistricts();
  });

  const classes = useStyles();
  const [value, setValue] = React.useState(0);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number): void => {
    setValue(newValue);
  };
  if (districts[currentDistrict] !== undefined) {
    return (
      <Content>
        <SideDrawer headerTitle={districts[currentDistrict].district_name} />
        <ContentFlexBox>
          <LeftContentFlexBox>
            <TableDiv>
              <IntersectionTable
                districts={districts}
                districtName={currentDistrict}
                isStaff={isStaff}
                user_id={user_id}
                defaultDistrictLat={defaultDistrictLat}
                defaultDistrictLng={defaultDistrictLng}
                districtLat={districtLat}
                districtLng={districtLng}
                selectedIntersection={selectedIntersection}
              />
              <AddButton>{isStaff ? <AddIntersection users={users} /> : <div />}</AddButton>
            </TableDiv>
          </LeftContentFlexBox>
          <div className={classes.root} id="map">
            <AppBar position="static" style={skeyeStyles.TabBar}>
              <Tabs
                value={value}
                onChange={handleChange}
                aria-label="MISC Tab"
                TabIndicatorProps={{ style: { backgroundColor: 'white' } }}
              >
                <Tab label="SkeYe Map" {...a11yProps(0)} style={skeyeStyles.TabOnly} />
                <Tab label="Traffic News" {...a11yProps(1)} style={skeyeStyles.TabOnly} />
              </Tabs>
            </AppBar>
            <TabPanel value={value} index={0}>
              <Map>
                <GoogleMap
                  districts={districts}
                  districtName={currentDistrict}
                  isStaff={isStaff}
                  user_id={user_id}
                />
              </Map>
            </TabPanel>
            <TabPanel value={value} index={1}>
              <TrafficDiv>
                <TrafficNews />
              </TrafficDiv>
            </TabPanel>
          </div>
        </ContentFlexBox>
      </Content>
    );
  }
  return (
    <Loader>
      <CircularProgress />
    </Loader>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  appZoom: state.app.zoom,
  currentDistrict: state.app.currentDistrict,
  districts: state.districts,
  districtLat: state.app.districtLat,
  districtLng: state.app.districtLng,
  defaultDistrictLat: state.app.defaultLat,
  defaultDistrictLng: state.app.defaultLng,
  isStaff: isStaff(state),
  selectedIntersection: state.app.selectedIntersection,
  users: state.users,
  user_id: state.authentication.user_id,
});

const mapDispatchToProps: DispatchProps = {
  deleteExistingIntersection,
  getDistricts,
  getUsers,
  logClick,
  resetDistricts,
  setDistrictCoord,
};
export default connect(mapStateToProps, mapDispatchToProps)(Home);

/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable @typescript-eslint/camelcase */
import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import Grid from '@material-ui/core/Grid';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
// eslint-disable-next-line object-curly-newline
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import { Redirect } from 'react-router-dom';
import SideDrawer from '../components/SideDrawer';
import { RootState } from '../reducers/rootReducer';
import { setDistrictCoord, SetCoordAction } from '../contexts/app';
import { profile } from '../contexts/profile';
import {
  STATE as districtState,
  GetDistrictsAction,
  getDistricts,
  resetDistricts,
  ResetDistrictAction,
} from '../contexts/districts';
import { deleteExistingIntersection, DeleteIntersectionAction } from '../contexts/intersection';
import { logClick, LogAction } from '../contexts/logClicks';
import { LOW_RES, MOBILE_DEVICE_MAX_WIDTH } from '../css/custom';
import { getUsers, STATE as userState, GetUsersAction } from '../contexts/users';

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
  id: any;
  email: any;
  username: any;
}

interface DispatchProps {
  deleteExistingIntersection: (id: string) => DeleteIntersectionAction;
  getDistricts(): GetDistrictsAction;
  getUsers(): GetUsersAction;
  resetDistricts(): ResetDistrictAction;
  logClick: (log_message: string, user_id: number) => LogAction;
  setDistrictCoord: (name: string, lat: number, lng: number, zoom: number) => SetCoordAction;
  profile: (id: string) => any;
}

const registerTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#808080',
    },
    secondary: {
      main: '#808080',
    },
  },
  overrides: {
    MuiInput: {
      underline: {
        '&:before': {
          borderBottom: '1px solid grey',
        },
        '&:hover:not($disabled):before': {
          borderBottom: '1px solid grey',
        },
      },
    },
    MuiInputLabel: {
      root: {
        color: 'grey',
      },
    },
    MuiFormLabel: {
      root: {
        color: 'grey',
      },
    },
    MuiInputBase: {
      root: {
        color: 'white',
      },
    },
    MuiGrid: {
      item: {
        color: 'grey',
      },
      container: {
        paddingBottom: '2rem',
      },
    },
  },
});

const useStyles = makeStyles(() => ({
  margin: {
    margin: registerTheme.spacing(1),
    paddingBottom: '3rem',
  },

  root: {
    '& > *': {
      width: 200,
    },
  },

  textInput: {
    display: 'flex',
    justifyContent: 'center',
  },
  iconStyle: {
    color: 'grey',
  },

  profileBox: {
    backgroundColor: '#212121',
    margin: 'auto',
    marginTop: '2vw',
    width: '25rem',
    height: '25rem',
    border: '1px solid grey',
    borderRadius: '15px',
    zIndex: 1,
  },

  invalid: {
    color: '#FFFFFF',
  },

  headerText: {
    color: '#04A777',
    fontSize: '2rem',
    fontFamily: 'roboto',
    marginTop: '3rem',
    marginBottom: '2rem',
  },

  texts: {
    fontSize: '0.8rem',
    color: 'grey',
    verticalAlign: 'middle',
    font: 'roboto',
  },
}));

// eslint-disable-next-line consistent-return
const Profile = (props: StateProps & DispatchProps): any => {
  const {
    districts, currentDistrict, profile, username, isStaff, email,
  } = props;

  const classes = useStyles();
  const [state] = React.useState(props);
  const { id } = state;
  useEffect(() => {
    profile(id);
  });
  if (id === 0) {
    return <Redirect push to="/" />;
  }

  if (districts[currentDistrict] !== undefined) {
    return (
      <Content>
        <SideDrawer headerTitle={districts[currentDistrict].district_name} />
        <ContentFlexBox>
          <ThemeProvider theme={registerTheme}>
            <div>
              <div className="background-style">
                <div className={classes.profileBox}>
                  <div className={classes.textInput}>
                    <h1 className={classes.headerText}> Profile </h1>
                  </div>
                  <div className="classes.margin">
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                      <Grid item>
                        <PersonIcon />
                      </Grid>
                      <Grid item>
                        <div>
                          ID:
                          {id}
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                  <div className="classes.margin">
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                      <Grid item>
                        <PersonIcon />
                      </Grid>
                      <Grid item>
                        <div>
                          Username:
                          {username}
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                  <div className="classes.margin">
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                      <Grid item>
                        <PersonIcon />
                      </Grid>
                      <Grid item>
                        <div>
                          Staff:
                          {isStaff ? ' yes' : ' no'}
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                  <div className="classes.margin">
                    <Grid container spacing={1} alignItems="flex-end" justify="center">
                      <Grid item>
                        <EmailIcon />
                      </Grid>
                      <Grid item>
                        <div>
                          Email:
                          {email}
                        </div>
                      </Grid>
                    </Grid>
                  </div>
                </div>
              </div>
            </div>
          </ThemeProvider>
        </ContentFlexBox>
      </Content>
    );
  }
};

const mapStateToProps = (state: RootState): StateProps => ({
  appZoom: state.app.zoom,
  currentDistrict: state.app.currentDistrict,
  districts: state.districts,
  districtLat: state.app.districtLat,
  districtLng: state.app.districtLng,
  defaultDistrictLat: state.app.defaultLat,
  defaultDistrictLng: state.app.defaultLng,
  isStaff: state.profile.is_staff,
  selectedIntersection: state.app.selectedIntersection,
  users: state.users,
  id: state.authentication.user_id,
  username: state.profile.username,
  email: state.profile.email,
});

const mapDispatchToProps: DispatchProps = {
  deleteExistingIntersection,
  getDistricts,
  getUsers,
  logClick,
  resetDistricts,
  setDistrictCoord,
  profile,
};
export default connect(mapStateToProps, mapDispatchToProps)(Profile);

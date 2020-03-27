import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import styled from 'styled-components';
import { connect } from 'react-redux';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Button from '@material-ui/core/Button';
import { SKEYE_WHITE } from '../css/custom';
import { isStaff } from '../contexts/authentication';
import { RootState } from '../reducers/rootReducer';

// MapQuest API is used to retrieve traffic news
// https://developer.mapquest.com/documentation/traffic-api/incidents/get/

// Resource URL: http://www.mapquestapi.com/traffic/v2/incidents

// Parameters required: API key, boundingBox
// Bounding Box for Montreal found at: https://boundingbox.klokantech.com/

// Bounding Box: Top right and bottom left areas corners of an area
/* Incident Types:
  1 = Construction
  2 = Event
  3 = Congestion/Flow
  4 = Incident/accident

  Severity Ranges from 0-4, which is an indicator for delay,
  0 being the lowest, 4 being the highest.

  Resource for dropdown menu:
  Material UI Menus
  https://material-ui.com/components/menus/
*/
const API_KEY = '24jtUJNMCXQg4pLgMchaC7p6Flihs7wO';

// const BOUNDING_BOX = '45.7047897,-73.47429525,45.41007553,-73.97290173';
// const API_CALL = `http://www.mapquestapi.com/traffic/v2/incidents?key=${API_KEY}&boundingBox=${BOUNDING_BOX}`;

const incidentsArray: any[] = [];

// StateProps
interface StateProps {
  isLoaded: boolean;
  incidents: any;
  anchorEl: any;
}
interface StaffProps {
  districts: any;
  isStaff: boolean;
  users: any;
  user_id: any;
}

// Function that creates a bounding box based on latitude and longitude provided
const createBoundingBox = (latitude: number, longitude: number): string => {
  // For now, the values are +0.02 and -0.02 for sake of demo.
  // Normally they would be +-0.001 but there are no traffic news retrieved.
  const upperBoundLatitude = latitude + 0.02;
  const upperBoundLongitude = longitude + 0.02;

  const lowerBoundLatitude = latitude - 0.02;
  const lowerBoundLongitude = longitude - 0.02;

  return `${upperBoundLatitude.toString()},${upperBoundLongitude.toString()},${lowerBoundLatitude.toString()},${lowerBoundLongitude.toString()}`;
};

// Function that converts ISO date into yyyy-mm-dd format
const toNormalDate = (retrievedDate: string): string => {
  const date = new Date(retrievedDate);
  const year = date.getFullYear();
  const month = date.getMonth();
  const day = date.getDate();
  return `${year}-${month}-${day}`;
};

// Function that filters intersections based on operator's assigned intersections
const filterList = (user_id: number, assigned_user_id: number): boolean => {
  if (user_id === assigned_user_id) {
    return true;
  }
  return false;
};

// Sorting objects by property in JavaScript:
// https://flaviocopes.com/how-to-sort-array-of-objects-by-property-javascript/

// Function that filters traffic news by oldest start time
const sortOldest = (incidents: any): any => {
  const sortedOldest = incidents.sort((a: any, b: any) => ((a.startTime > b.startTime) ? 1 : -1));
  return sortedOldest;
};

// Function that sorts traffic by most recent
const sortNewest = (incidents: any): any => {
  const sortedNewest = incidents.sort((a: any, b: any) => ((a.startTime < b.startTime) ? 1 : -1));
  return sortedNewest;
};

// Function that sorts traffic by highest severity first
const sortByHighSeverity = (incidents: any): any => {
  const sortedHigh = incidents.sort((a: any, b: any) => ((a.severity < b.severity) ? 1 : -1));
  return sortedHigh;
};

// Function that sorts traffic news by lowest severity first
const sortByLowSeverity = (incidents: any): any => {
  const sortedLow = incidents.sort((a: any, b: any) => ((a.severity > b.severity) ? 1 : -1));
  return sortedLow;
};

// Styled Components
const OuterContainer = styled.div`
  overflow: scroll;
  height: 41rem;
  overflow-x: hidden;
`;

const OuterDiv = styled.div`
  color: ${SKEYE_WHITE};
  
  display: flex;
  flex-direction: column;
`;

const CardStyle = styled.div`
  margin: 1rem;
  :first-child {
    margin-top: 0;
  }
`;

const Loader = styled.div`
  margin-top: 4rem;
  text-align: center;
`;

const MenuItemWrap = styled.div`
  :hover{
    background-color: #f5f5f5;
  }
`;

class TrafficNews extends React.Component<StaffProps, StateProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoaded: false,
      incidents: [],
      anchorEl: null,
    };

    this.handleSortHigh = this.handleSortHigh.bind(this);
    this.handleSortLow = this.handleSortLow.bind(this);
    this.handleSortNew = this.handleSortNew.bind(this);
    this.handleSortOld = this.handleSortOld.bind(this);

    this.handleClick = this.handleClick.bind(this);
    this.handleClose = this.handleClose.bind(this);
  }

  componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    let latitude: number;
    let longitude: number;
    let boundingBox: string;
    const { isStaff } = this.props;
    let TRAFFIC_API_CALL = '';

    // Function that retrieves all the intersections based on the operator's assigned intersections
    const operatorNewsFetch = (): void => {
      const { districts, user_id } = this.props;

      /* eslint-disable no-plusplus */
      for (let i = 0; i < districts[0].intersections.length; i++) {
        // Filters list of all intersection based on assigned intersections
        if (filterList(user_id, districts[0].intersections[i].user_id)) {
          latitude = districts[0].intersections[i].latitude;
          longitude = districts[0].intersections[i].longitude;

          // Creates a bounding box based on each intersection
          boundingBox = createBoundingBox(latitude, longitude);

          // API call with created bounded box and appends all retrieved traffic news together
          TRAFFIC_API_CALL = `http://www.mapquestapi.com/traffic/v2/incidents?key=${API_KEY}&boundingBox=${boundingBox}`;

          fetch(TRAFFIC_API_CALL)
            .then((results) => results.json())
            .then((data) => {
              const tempData = data.incidents;

              if (tempData.length !== 0) {
                incidentsArray.push(...data.incidents);
              }
              this.setState({
                isLoaded: true,
                incidents: incidentsArray,
              });
            });
        }
      }
    };

    // Function that fetches all traffic news of a city
    const staffNewsFetch = (): void => {
      fetch(`http://www.mapquestapi.com/traffic/v2/incidents?key=${API_KEY}&boundingBox=45.7047897,-73.47429525,45.41007553,-73.97290173`)
        .then((results) => results.json())
        .then((data) => {
          this.setState({
            isLoaded: true,
            incidents: data.incidents,
          });
        });
    };

    // If the user is staff, all traffic news from the city will be retrieved
    // Else, only operator's intersections traffic news will be retrieved
    if (isStaff) {
      staffNewsFetch();
    } else {
      operatorNewsFetch();
    }
  }

  /* eslint-disable react/no-access-state-in-setstate */
  // Function handling closing the menu
  handleClose = (): void => {
    this.setState({ anchorEl: null });
  }

  // Functions handling clicking of the menu buttons
  handleClick = (event: any): void => {
    this.setState({ anchorEl: event.currentTarget });
  }

  // Functions that handle changing the state of the incidents list
  handleSortOld = (e: any, incidents: any): void => {
    this.setState({ incidents: sortOldest(incidents) });
    this.setState({ anchorEl: null });
  }

  handleSortNew = (e: any, incidents: any): void => {
    this.setState({ incidents: sortNewest(incidents) });
    this.setState({ anchorEl: null });
  }

  handleSortHigh = (e: any, incidents: any): void => {
    this.setState({ incidents: sortByHighSeverity(incidents) });
    this.setState({ anchorEl: null });
  }

  handleSortLow = (e: any, incidents: any): void => {
    this.setState({ incidents: sortByLowSeverity(incidents) });
    this.setState({ anchorEl: null });
  }

  render(): JSX.Element {
    const { isLoaded, incidents, anchorEl } = this.state;
    if (!isLoaded) {
      return (
        <Loader>
          <CircularProgress />
        </Loader>
      );
    }
    /* eslint-disable max-len */
    /* eslint-disable @typescript-eslint/explicit-function-return-type */
    return (
      <OuterDiv>
        <Button
          aria-controls="simple-menu"
          aria-haspopup="true"
          onClick={this.handleClick}
          style={{
            backgroundColor: 'white', width: 'fit-content', marginLeft: '1rem', marginBottom: '1rem', color: 'black',
          }}
        >
          Sort By ...
        </Button>
        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={this.handleClose}
          style={{ color: 'black' }}
        >
          {/* <MenuItem style={{ color: 'black', backgroundColor: 'white'}}>Sort</MenuItem> */}
          <MenuItemWrap>
            <MenuItem style={{ color: 'black' }} onClick={(event): void => this.handleSortOld(event, incidents)}>Oldest</MenuItem>
          </MenuItemWrap>
          <MenuItem style={{ color: 'black' }} onClick={(event): void => this.handleSortNew(event, incidents)}>Most Recent</MenuItem>
          <MenuItem style={{ color: 'black' }} onClick={(event): void => this.handleSortHigh(event, incidents)}>Highest Severity</MenuItem>
          <MenuItem style={{ color: 'black' }} onClick={(event): void => this.handleSortLow(event, incidents)}>Lowest Severity</MenuItem>

        </Menu>
        <OuterContainer>
          {incidents.map(
            (incident: {
              id: string | number | undefined;
              type: any;
              shortDesc: string;
              fullDesc: string;
              severity: any;
              startTime: any;
              endTime: any;
            }) => (
              <CardStyle key={incident.id}>
                <Card>
                  <CardContent>
                    <div style={{ display: 'flex' }}>
                      <Typography variant="h5">
                        Traffic Type: &nbsp;
                        {(() => {
                          switch (incident.type) {
                            case 1:
                              return 'Construction';
                            case 2:
                              return 'Event';
                            case 3:
                              return 'Congestion/Flow';
                            case 4:
                              return 'Incident/Accident';
                            default:
                              return 'Traffic';
                          }
                        })()}
                        &nbsp;
                      </Typography>
                      {(() => {
                        switch (incident.type) {
                          case 1:
                            return <AnnouncementIcon style={{ color: 'orange' }} />;
                          case 2:
                            return <AnnouncementIcon style={{ color: 'purple' }} />;
                          case 3:
                            return <AnnouncementIcon style={{ color: '#d62f2f' }} />;
                          case 4:
                            return <AnnouncementIcon style={{ color: 'red' }} />;
                          default:
                            return <AnnouncementIcon />;
                        }
                      })()}
                    </div>
                    <Typography variant="h6">{incident.shortDesc}</Typography>
                    <Typography variant="subtitle1">
                      {incident.fullDesc}
                      <br />
                      <br />
                      <b>Severity:</b>
                      {' '}
                      {(() => {
                        switch (incident.severity) {
                          case 0:
                            return 'Very Low Delay';
                          case 1:
                            return 'Low Delay';
                          case 2:
                            return 'Normal Delay';
                          case 3:
                            return 'Medium Delay';
                          case 4:
                            return 'High Delay';
                          default:
                            return 'Normal Delay';
                        }
                      })()}
                      {' '}
                      <br />
                      <b>Start Date:</b>
                      {' '}
                      {toNormalDate(incident.startTime)}
                      {' '}
                      <br />
                      <b>End Date:</b>
                      {' '}
                      {toNormalDate(incident.endTime)}
                    </Typography>
                  </CardContent>
                </Card>
              </CardStyle>
            ),
          )}
        </OuterContainer>
      </OuterDiv>
    );
  }
}
const mapStateToProps = (state: RootState): StaffProps => ({
  districts: state.districts,
  isStaff: isStaff(state),
  users: state.users,
  user_id: state.authentication.user_id,
});
export default connect(mapStateToProps)(TrafficNews);

import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import AnnouncementIcon from '@material-ui/icons/Announcement';
import styled from 'styled-components';
import { SKEYE_WHITE } from '../css/custom';
import { connect } from 'react-redux';
import { isStaff } from '../contexts/authentication';
import { RootState } from '../reducers/rootReducer';
import { getUsers, STATE as userState, GetUsersAction } from '../contexts/users';

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
*/
const { REACT_APP_API_URL } = process.env;
const API_KEY = '24jtUJNMCXQg4pLgMchaC7p6Flihs7wO';

// const BOUNDING_BOX = '45.7047897,-73.47429525,45.41007553,-73.97290173';
// const API_CALL = `http://www.mapquestapi.com/traffic/v2/incidents?key=${API_KEY}&boundingBox=${BOUNDING_BOX}`;

const API_DOMAIN = REACT_APP_API_URL;

const incidentsArray: any[] = [];

// StateProps
interface StateProps {
  isLoaded: boolean;
  incidents: any;
}
interface StaffProps {
  districts: any;
  isStaff: boolean;
  users: any;
  user_id: any; 
}

// Function that creates a bounding box based on latitude and longitude provided
const createBoundingBox = (latitude: number, longitude: number): string => {
  // For now, the values are +0.1 and -0.1 for sake of demo.
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

const filterList = (user_id: number, assigned_user_id: number): boolean => {
  
  if (user_id === assigned_user_id) {
    return true;
  }
  return false;
};

// Styled Components
const OuterContainer = styled.div`
  overflow: scroll;
  height: 100%;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const OuterDiv = styled.div`
  color: ${SKEYE_WHITE};
  margin-top: 5rem;
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

class TrafficNews extends React.Component<StaffProps, StateProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      isLoaded: false,
      incidents: [],
    };
  }

  componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    let latitude: number;
    let longitude: number;
    let boundingBox: string;
    let tempData: any[] = [];
    let TRAFFIC_API_CALL = '';
    const districtFetch = (): void => {

      // Fetch the list of intersections
      for(let i = 0; i < this.props.districts[0].intersections.length; i++){
        if(filterList(this.props.user_id,this.props.districts[0].intersections[i].user_id)){
          latitude = this.props.districts[0].intersections[i].latitude;
          longitude = this.props.districts[0].intersections[i].longitude;
      
          boundingBox = createBoundingBox(latitude, longitude);
      
          TRAFFIC_API_CALL = `http://www.mapquestapi.com/traffic/v2/incidents?key=${API_KEY}&boundingBox=${boundingBox}`;
      
          fetch(TRAFFIC_API_CALL)
          .then((results) => results.json())
          .then((data) => {
            tempData = data.incidents;
      
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
    const adminFetch = (): void => {
      fetch(`http://www.mapquestapi.com/traffic/v2/incidents?key=${API_KEY}&boundingBox=45.7047897,-73.47429525,45.41007553,-73.97290173`)
        .then((results) => results.json())
        .then((data) =>{
          this.setState({
            isLoaded: true,
            incidents: data.incidents,
          })
        })
    }
    if(this.props.isStaff){
      console.log('is staff')
      adminFetch();
    }
    else{
      console.log('is not staff')
      districtFetch();
    }
  }

  render(): JSX.Element {
    const { isLoaded, incidents } = this.state;
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
}) 
export default connect(mapStateToProps)(TrafficNews);

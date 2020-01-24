import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import { SKEYE_WHITE, LOW_RES } from '../css/custom';

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
*/

const API_KEY = '24jtUJNMCXQg4pLgMchaC7p6Flihs7wO';

const BOUNDING_BOX = '45.7047897,-73.47429525,45.41007553,-73.97290173';
const API_CALL = `http://www.mapquestapi.com/traffic/v2/incidents?key=${API_KEY}&boundingBox=${BOUNDING_BOX}`;

interface StateProps {
  error: any;
  isLoaded: boolean;
  incidents: any;
}

const OuterContainer = styled.div`
  overflow: scroll;
  height: 88vh;
  overflow-x: hidden;
  overflow-y: hidden;
`;

const OuterDiv = styled.div`
  color: ${SKEYE_WHITE};
  margin-top: 5rem;
  display: flex;
  flex-direction: column;
  @media only screen and (max-width: ${LOW_RES}px) {
    & {
      margin: 1rem 1rem 1rem 0rem;
    }
  }
`;

const CardStyle = styled.div`
  margin: 1rem;
  :first-child {
    margin-top: 0;
  }
`;

class TrafficNews extends React.Component<{}, StateProps> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      incidents: [],
    };
  }

  componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    fetch(API_CALL)
      .then((results) => results.json())
      .then(
        (data) => {
          this.setState({
            isLoaded: true,
            incidents: data.incidents,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            error,
          });
        },
      );
  }

  render(): JSX.Element {
    const { error, isLoaded, incidents } = this.state;
    if (error) {
      return <div>Error</div>;
    }
    if (!isLoaded) {
      return <CircularProgress />;
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
                    </Typography>
                    <Typography variant="h6">{incident.shortDesc}</Typography>
                    <Typography variant="subtitle1">
                      {incident.fullDesc}
                      <br />
                      <br />
                      <b>Severity:</b>
                      {' '}
                      {incident.severity}
                      {' '}
                      <br />
                      <b>Start Time:</b>
                      {' '}
                      {incident.startTime}
                      {' '}
                      <br />
                      <b>End Time:</b>
                      {' '}
                      {incident.endTime}
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

export default TrafficNews;

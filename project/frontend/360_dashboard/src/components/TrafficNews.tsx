import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';
import Paper from '@material-ui/core/Paper'

//MapQuest API is used to retrieve traffic news
//https://developer.mapquest.com/documentation/traffic-api/incidents/get/

//Resource URL: http://www.mapquestapi.com/traffic/v2/incidents

//Parameters required: API key, boundingBox
//Bounding Box for Montreal found at: https://boundingbox.klokantech.com/

//Bounding Box: Top right and bottom left areas corners of an area
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
    background-color: white;
    width: 55rem;
    overflow: scroll;
    padding: 1rem;
    height: 30rem;
`;

const OuterDiv = styled.div`
    color: white; 
    margin: 5rem;
    display: flex;
    flex-direction: column; 
`;

class TrafficNews extends React.Component<{}, StateProps>{
    constructor(props: any){
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            incidents: []
        };
    }

    componentDidMount(): void { 
        //eslint-disable-next-line no-shadow
        fetch(API_CALL)
        .then((results) => results.json()).then((data) => {
        this.setState({
            isLoaded: true,
            incidents: data.incidents
        });
        },
        (error) => {
        this.setState({
            isLoaded: true,
            error,
            });
        });
    }

    render(): JSX.Element {
        const { error, isLoaded, incidents } = this.state; 
        console.log(incidents);
        if(error){
            return(
                <div>
                    Error
                </div>
            );
        }
        else if(!isLoaded){
            return(
                <CircularProgress />
            );
        }
        else{
            return(
                <OuterDiv>
                <Typography variant="h4">
                    Traffic News
                </Typography>
                <OuterContainer>
                    {incidents.map((incident: { id: string | number | undefined; type: any; shortDesc: string; fullDesc: string; severity: any; startTime: any; endTime: any;}) => (
                        <Paper elevation={3} key={incident.id} style={{marginBottom: '2rem', padding:'1rem'}}>
                            <Typography variant="h6">
                                {(() => {
                                    switch(incident.type){
                                        case 1: return "Construction";
                                        case 2: return "Event";
                                        case 3: return "Congestion/Flow";
                                        case 4: return "Incident/Accident";
                                    }
                                })()}
                            </Typography>
                            <Typography variant="subtitle1">
                                {incident.shortDesc}
                            </Typography>
                            {incident.fullDesc}
                            <br/><br/>
                            <b>Severity:</b> {incident.severity} <br />
                            <b>Start Time:</b> {incident.startTime} <br />
                            <b>End Time:</b> {incident.endTime}
                        </Paper>
                    ))}
                </OuterContainer>
                </OuterDiv>
            )
        }
    }
}

export default TrafficNews; 
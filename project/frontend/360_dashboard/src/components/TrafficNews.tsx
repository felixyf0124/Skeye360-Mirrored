import React from 'react';

//MapQuest API is used to retrieve traffic news
//https://developer.mapquest.com/documentation/traffic-api/incidents/get/

//Resource URL: http://www.mapquestapi.com/traffic/v2/incidents

//Parameters required: API key, boundingBox
//Bounding Box for Montreal found at: https://boundingbox.klokantech.com/

//O34: $$dW0735800$$eW0732800$$fN0454200$$gN0452400
//255: $$c(W 73°58'00"--W 73°28'00"/N 45°42'00"--N 45°24'00")

//http://www.mapquestapi.com/traffic/v2/incidents?key=KEY&boundingBox=39.95,-105.25,39.52,-104.71&filters=construction,incidents

//<bounding><westbc>-73.97290173</westbc><eastbc>-73.47429525</eastbc><northbc>45.7047897</northbc><southbc>45.41007553</southbc></bounding>

//[[[-73.97290173,45.41007553],[-73.47429525,45.41007553],[-73.47429525,45.7047897],[-73.97290173,45.7047897],[-73.97290173,45.41007553]]]
//westlimit=-73.972902; southlimit=45.410076; eastlimit=-73.474295; northlimit=45.70479 //I GUESS USE THIS???

//Bounding Box: Top right and bottom left areas corners of an area
/* Incident Types:
    1 = Construction
    2 = Event
    3 = Congestion/Flow
    4 = Incident/accident
*/

const API_KEY = '24jtUJNMCXQg4pLgMchaC7p6Flihs7wO';

const BOUNDING_BOX = '45.7047897,-73.47429525,45.41007553,-73.97290173';
const EXAMPLE = '39.95,-105.25,39.52,-104.71';
const FILTERS = 'congestion';
const API_CALL = `http://www.mapquestapi.com/traffic/v2/incidents?key=${API_KEY}&boundingBox=${BOUNDING_BOX}`;

interface StateProps {
    error: any;
    isLoaded: boolean;
    incidents: any;
}

interface IncidentProps {
    id: number;
    type: number;
    severity: number;
    startTime: string;
    endTime: string;
    shortDesc: string;
    fullDesc: string;
} 

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

        return(
            <div>
            {incidents.map((incident: { id: string | number | undefined; type: React.ReactNode; }) => (
              <li key={incident.id}>
                {incident.type}
              </li>
            ))}
            </div>
        )
    }
}

export default TrafficNews; 
import React from 'react';
import Typography from '@material-ui/core/Typography';
import styled from 'styled-components';

const API_KEY="08e715234386b00a47120f045bc02858";
const city = 'Montreal';  
const API_CALL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}`;

//Reference: https://reactjs.org/docs/faq-ajax.html
//On how to make API calls in ReactJS

const TempDiv = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
`;

//Conversion from Kelvin to Celsius
const convertCelsius = (kelvinWeather: any): any => {
    return Number(kelvinWeather - 273).toFixed();
};

interface StateProps {
    error: any,
    isLoaded: boolean,
    weatherIcon: string,
    temperature: string,
    tempDescription: string,
}
//Weather Component
class Weather extends React.Component<{},StateProps> {
    constructor(props: any) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            weatherIcon: "",
            temperature: "",
            tempDescription: "",
        };
    }
    //Fetches the icon, temperature, and weather from API.
    componentDidMount(): void {
      // eslint-disable-next-line no-shadow
        fetch(API_CALL)
        .then(results => {
            return results.json()
            }).then(data =>{
                this.setState({
                    isLoaded: true,
                    weatherIcon: data.weather[0].icon,
                    temperature: data.main.temp,
                    tempDescription: data.weather[0].main,
                })
            },
            (error) => {
                this.setState({
                    isLoaded: true,
                    error
                });
            }
        );
    }
    //Renders the Weather component
    render(): JSX.Element {
        //Retrieves the variables below with their updated states
        const { error, isLoaded, weatherIcon, temperature, tempDescription } = this.state;

        //Temperature retrieved by API is given in kelvin, so convert to celsius
        const tempCelsius = convertCelsius(temperature);
        const iconsrc = "http://openweathermap.org/img/w/" + weatherIcon + ".png";
        if(error){
            return<div>Error: {error.message}</div>
        }
        else if (!isLoaded){
            return<div>Loading...</div>
        }
        else{
            return (
                <TempDiv>
                    <img src={iconsrc} />
                    <Typography variant="h6">
                        &nbsp;{tempCelsius}&deg;C
                        &nbsp;{tempDescription}
                    </Typography>
                </TempDiv>
            );
        }
    }
}
export default Weather; 
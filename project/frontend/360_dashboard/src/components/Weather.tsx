import React, { Component } from 'react';
const API_KEY="08e715234386b00a47120f045bc02858";
const city = 'Montreal'; //for now just hardcode, fetch city later from DB just to make sure it works 
const API_CALL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}`;

//Reference: https://reactjs.org/docs/faq-ajax.html
//On how to make API calls in ReactJS
//Temperature is actually given in Kelvin, so change that! 

const convertCelsius = (kelvinWeather: any): any => {
    return Number(kelvinWeather - 273).toFixed();
};
class Weather extends React.Component<{},{error: any, isLoaded: boolean, weatherIcon: string, temperature: string, tempDescription: string}> {
    constructor(props: any) {
        super(props);
        this.state = {
            error: null,
            isLoaded: false,
            weatherIcon: "",
            temperature: "",
            tempDescription: ""
        };
    }
    componentDidMount(): void {
      // eslint-disable-next-line no-shadow
        fetch(API_CALL)
        .then(results => {
            return results.json()
            }).then(data =>{
                this.setState({
                    isLoaded: true,
                    weatherIcon: data.weather.icon,
                    temperature: data.main.temp,
                    tempDescription: data.weather.description,
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
    
    render(): JSX.Element {
        const { error, isLoaded, weatherIcon, temperature, tempDescription } = this.state;
        const tempCelsius = convertCelsius(temperature);
        if(error){
            return<div>Error: {error.message}</div>
        }
        else if (!isLoaded){
            return<div>Loading...</div>
        }
        else{
            return (
                <div>
                    <div>Icon:{weatherIcon}</div>
                    <div>Temperature: {tempCelsius}&deg;C</div>
                    <div>Description:{tempDescription}</div>
              
                </div>
            );
        }
    }
}
export default Weather; 
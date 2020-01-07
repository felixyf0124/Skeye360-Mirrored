import React, { Component } from 'react';
const API_KEY="08e715234386b00a47120f045bc02858";
const city = '';
const API_CALL = `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=${API_KEY}`;

interface StateProps{
    currentWeather: string
    getCurrentWeather: any
}
interface DispatchProps{
    currentWeather: string
}


class Weather extends React.Component<(StateProps & DispatchProps) | any> {
    public componentDidMount(): void {
      // eslint-disable-next-line no-shadow
        fetch(API_CALL)
        .then(results => {
            return results.json()
        }).then(data =>{
            let currWeather = data.results.main;
        });
        //this.setState
    }
    public render(): JSX.Element {

        return (
            <div>

            </div>
        );
    }
}
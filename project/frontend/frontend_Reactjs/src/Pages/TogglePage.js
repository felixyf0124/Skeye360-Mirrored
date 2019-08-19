import React, {Component} from 'react';
import { connect } from 'react-redux';

import DashBoard from '../Components/DashBoard/DashBoard';
import Toggle from '../Components/Toggles/Toggle';
import ToggleCreate from  '../Components/Toggles/ToggleCreate';
import ToggleList from "../Components/Toggles/ToggleList";
class TogglePage extends Component{


    render(){
        console.log(this.props);
        return (
            <div>
                <div style={{margin:22+'px'}}>
                </div>
                <div>
                    <h1>Toggle Page</h1>
                </div>
                <div>
                    <DashBoard name="Capstone SOEN 490 Milestone 0">
                        <Toggle name="Feature 1"/>

                        <Toggle name="Feature 2"/>
                    </DashBoard>
                    <DashBoard name="Capstone SOEN 490 Milestone 1">
                        <Toggle name="Feature 3"/>

                        <Toggle name="Feature 4"/>

                        <ToggleCreate/>
                    </DashBoard>

                    <ToggleList></ToggleList>
                </div>
            </div>
        );
    }



}

export default TogglePage;
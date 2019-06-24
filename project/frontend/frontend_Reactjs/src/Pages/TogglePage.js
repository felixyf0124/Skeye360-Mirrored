import React, {Component} from 'react'

import DashBoard from '../Components/DashBoard/DashBoard'
import Toggle from '../Components/Toggles/Toggle'
import ToggleCreate from  '../Components/Toggles/ToggleCreate'
class TogglePage extends Component{


    render(){
        return (
            <div>
                <div style={{margin:22+'px'}}>
                </div>
                <div>
                    <h1>Simple Toggle Page</h1>
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
                </div>
            </div>
        );
    }



}

export default TogglePage;
import React, {Component} from 'react';
import {connect} from 'react-redux';

import DashBoard from '../DashBoard/DashBoard';
import Toggle from './Toggle';



class ToggleList extends Component {

    getGroupName() {
        console.log(this.props.toggles[0].group_name);
        return (this.props.toggles[0].group_name);
    }
    renderList() {
        return this.props.toggles.map((toggle) => {

            return (
                <div className='item' key={toggle.id}>
                    <Toggle name={toggle.name} toggleState={toggle.toggle_state}/>

                </div>
            );
        });
    }


    render(){
        return (
            <div>
                <DashBoard name={this.getGroupName()}>
                    {this.renderList()}
                </DashBoard>
            </div>
        );

    }
}

const mapStateToProps = state => {
    console.log(state);
    return {toggles:state.toggles};
};

export default connect(mapStateToProps) (ToggleList);
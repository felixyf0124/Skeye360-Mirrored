import React, {Component} from 'react'
import './Toggle.css'

class Toggle extends Component{
    constructor(props){
        super(props);
        if(this.props.toggleState != null) {
            this.state = {
                toggleState: this.props.toggleState
            };
        }else{
            this.state = {
                toggleState: 'OFF'
            };
        }

        //bind
        this.setToggleState = this.setToggleState.bind(this);
    }

    getToggleState() {
        return this.state.toggleState;
    }
    setToggleState(){
        if(this.state.toggleState === 'ON') {
            this.setState({toggleState: 'OFF'});
        }else {
            this.setState({toggleState: 'ON'});
        }
    }

    // switchHandler(){
    //     const {current_toggle_state} = this.state;
    //     if(current_toggle_state == 'OFF'){
    //         this.setToggleState("ON");
    //     }else if(current_toggle_state == 'ON')
    //     {
    //         this.setToggleState('OFF');
    //     }
    // }

    render(){

        const btnChecked = this.getToggleState()==='ON'?'checked':'';


        const _toggle = (
            <div className="toggle">
                <table className="container">
                    <tbody>
                    <tr className="container row w-auto m-auto text-center">

                        <td className="col-2"/>
                        <th className="col-5  text-left">
                            <label>{this.props.name}</label>
                        </th>
                        <td className="col-1 text-left">
                            <label className="w_fix">
                                {this.state.toggleState}
                            </label>
                        </td>
                        <td className="col-2 text-right">
                            <label className="switch">
                                <input type="checkbox" onClick={this.setToggleState} defaultChecked={btnChecked}/>
                                {/*{this.state.toggleState}*/}
                                <span className="slider round"/>
                            </label>
                        </td>
                        <td className="col-2"/>
                    </tr>
                    </tbody>
                </table>


                {/*<button onClick={this.setToggleState.bind(this)}></button>*/}
                {/*<button onClick={()=>this.setToggleState()}></button>*/}
                {/*<input type='checkbox' onClick={this.setToggleState().bind(this)} />*/}

            </div>
        );

        return _toggle;
    }

}

export default Toggle;
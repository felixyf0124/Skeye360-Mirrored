import React, {Component} from 'react'
import './Toggle.css'

class Toggle extends Component{
    constructor(props){
        super(props);
        this.state = {
            currentToggleState: 'OFF'
        };

        //bind
        this.setToggleState = this.setToggleState.bind(this);
    }

    getToggleState() {
        return this.state.currentToggleState;
    }
    setToggleState(){
        if(this.state.currentToggleState === 'ON') {
            this.setState({currentToggleState: 'OFF'});
        }else {
            this.setState({currentToggleState: 'ON'});
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
        const _toggle = (
            <div className="toggle">
                <table className="container">
                    <tbody>
                    <tr className="container row w-auto m-auto text-center">

                        <td className="col-2"></td>
                        <th className="col-5  text-left">
                            <label>{this.props.name}</label>
                        </th>
                        <td className="col-1 text-left">
                            <label className="w_fix">
                                {this.state.currentToggleState}
                            </label>
                        </td>
                        <td className="col-2 text-right">
                            <label className="switch">
                                <input type="checkbox" onClick={this.setToggleState}/>
                                {/*{this.state.currentToggleState}*/}
                                <span className="slider round"></span>
                            </label>
                        </td>
                        <td className="col-2"></td>
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
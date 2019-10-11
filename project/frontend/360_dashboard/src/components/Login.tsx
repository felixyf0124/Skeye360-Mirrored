import React, { Component } from "react";
import { Button } from 'react-bootstrap';
import SkeyeMap from "../containers/SkeyeMap";
import { any } from "prop-types";
import { jsxAttribute } from "@babel/types";
// import { showMap } from '../App';

class Login extends Component {
    state = {
        email: "",
        password: "",
        map: false,
    };
    public showMap() {
        this.state.map = true;
    }
    render(){
        return( 
            <div className="login-container">
            <form>
                    <div className="form-group">
                        <label>Username</label>
                        <input type="text" />
                    </div>
                    <div className="form-group">
                        <label>Password</label>
                        <input type="password" />
                    </div>

                    <Button className="login-btn" color="primary" type="submit" onClick={this.showMap}>Log In</Button>
                </form>
            </div>
        );
    }
}
export default Login;
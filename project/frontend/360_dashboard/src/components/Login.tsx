import React, { Component } from "react";
import { Button } from 'react-bootstrap';

class Login extends Component {
    state = {
        email: "",
        password: ""
    };
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

                    <Button className="login-btn" color="primary" type="submit">Log In</Button>
                </form>
            </div>
        );
    }
}
export default Login;
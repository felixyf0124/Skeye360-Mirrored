import React from 'react';
import { RootState } from '../reducers/rootReducer';
import { connect } from 'react-redux';
import { authenticate } from '../contexts/authentication';

interface Props {
    authenticated: boolean;
}

interface StateProps {
    email: string;
    password: string;
    error: string;
}

interface DispatchProps {
    authenticate: (email: string, password: string) => any;
}

function Login(props: StateProps & DispatchProps): React.ReactElement {
    const [state, setState] = React.useState(props);
    const { email, password } = state;

    console.log("ASD:" + email + "," + password);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    return( 
        <div className="login-container">
            <form onSubmit={(e) => {
                e.preventDefault();
                props.authenticate(email, password);
            }}>
                <div className="form-group">
                    <label>Username</label>
                    <input
                        type="text"
                        name="email"
                        value={email}
                        onChange={handleChange}
                    />
                </div>
                <div className="form-group">
                    <label>Password</label>
                    <input
                        type="password"
                        name="password"
                        value={password}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">
                    Login
                </button>
            </form>
        </div>
    );
}

const mapStateToProps = (state: RootState): StateProps => ({
    email: '',
    password: '',
    error: '',
});

const mapDispatchToProps: DispatchProps = {
    authenticate,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Login);
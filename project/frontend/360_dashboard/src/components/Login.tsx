import React from 'react';
import { RootState } from '../reducers/rootReducer';
import { connect } from 'react-redux';
import { authenticate } from '../contexts/authentication';
import { Redirect } from 'react-router-dom';
import Header from './Header';
import { push } from 'connected-react-router';

interface StateProps {
    authenticated: boolean,
    email: string;
    password: string;
    error: string;
}

interface DispatchProps {
    authenticate: (email: string, password: string) => void;
    historyPush: (url: string) => void;
}

const Login = (props: StateProps & DispatchProps): JSX.Element => {
    const [ state, setState ] = React.useState(props);
    const { email, password } = state;

    console.log("ASD:" + email + "," + password);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
        setState({ ...state, [e.target.name]: e.target.value });
    };

    const handleLoginClick = () => {
        const { historyPush } = props;
        historyPush('/login');
    };

    if (props.authenticated) return <Redirect push to={'/'} />;

    return (
        <div>
            <Header />
            <div className="login-container">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    props.authenticate(email, password);
                    handleLoginClick();
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
        </div>
    );
}

const mapStateToProps = (state: RootState): StateProps => ({
    authenticated: state.authentication.authenticated,
    email: '',
    password: '',
    error: '',
});

const mapDispatchToProps: DispatchProps = {
    authenticate,
    historyPush: push,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Login);
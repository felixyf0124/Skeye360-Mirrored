import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { push } from 'connected-react-router';
import { RootState } from '../reducers/rootReducer';
import { authenticate } from '../contexts/authentication';
import Header from '../components/Header';

interface StateProps {
    username: string;
    password: string;

    authenticated: boolean;
    name: string;
    sessionToken: string;
    error: string;
}

interface DispatchProps {
    authenticate: (username: string, password: string) => void;
    historyPush: (url: string) => void;
}

const Login = (props: StateProps & DispatchProps): JSX.Element => {
  const [state, setState] = React.useState(props);
  const { username, password } = state;

  console.log(`ASD:${username},${password}`);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleLoginClick = () => {
    const { historyPush } = props;
    historyPush('/login');
    if (!props.authenticated) {
      return <Redirect push to="/" />;
    }
  };

  if (props.authenticated) alert(`Welcome ${props.name}! `);
  if (props.authenticated) return <Redirect push to="/" />;

  return (
    <div>
      <Header />
      <div className="form-container">
        <form onSubmit={(e) => {
          e.preventDefault();
          props.authenticate(username, password);
          handleLoginClick();
        }}
        >
          {props.error !== '' ? (
            <div className="form-group">
              <label>{props.error}</label>
            </div>
          ) : (
            <div />
          )}
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              name="username"
              value={username}
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
};

const mapStateToProps = (state: RootState): StateProps => ({
  username: '',
  password: '',

  authenticated: state.authentication.authenticated,
  name: state.authentication.username,
  sessionToken: state.authentication.sessionToken,
  error: state.authentication.error,
});

const mapDispatchToProps: DispatchProps = {
  authenticate,
  historyPush: push,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

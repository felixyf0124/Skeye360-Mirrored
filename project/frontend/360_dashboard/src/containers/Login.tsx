import React from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { push } from 'connected-react-router';
import { RootState } from '../reducers/rootReducer';
import { authenticate } from '../contexts/authentication';
import Header from '../components/Header';
import { logClick } from '../contexts/LogClicks';


interface StateProps {
    username: string;
    password: string;
    log_message: string;
    authenticated: boolean;
    name: string;
    sessionToken: string;
    error: string;
    user_id: number;
}

interface DispatchProps {
    authenticate: (username: string, password: string) => void;
    historyPush: (url: string) => void;
    logClick: (
      log_message: string,
      user_id: number,
    ) => any;
}

const Login = (props: StateProps & DispatchProps): JSX.Element => {
  const [state, setState] = React.useState(props);
  const {
    username,
    password,
    log_message,
    authenticated,
    name,
    error,
    user_id,
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    console.log("HELLO");
    setState({ ...state, [e.target.name]: e.target.value });
    //setState({...state, log_message: login_log_message});
    console.log(log_message);
  
    console.log("LOG MESSAGE HERE");
    console.log(username);
  };


  // eslint-disable-next-line consistent-return
  const handleLoginClick = (): any => {
    const { historyPush } = props;
    historyPush('/login');
    if (!authenticated) {
      return <Redirect push to="/" />;
    }
    console.log("handle click");
    
  };


  // eslint-disable-next-line no-alert
  if (authenticated) alert(`Welcome ${name}! `);
  if (authenticated) return <Redirect push to="/" />;

  return (
    <div>
      <Header />
      <div className="form-container">
        <form onSubmit={(e): void => {
          e.preventDefault();
          props.authenticate(username, password);
          handleLoginClick();
          props.logClick(log_message, user_id); 
        }}
        >
          {error !== '' ? (
            <div className="form-group">
              <div>{error}</div>
            </div>
          ) : (
            <div />
          )}
          <div className="form-group">
            <label htmlFor="username">
              Username
              <input
                type="text"
                name="username"
                value={username}
                onChange={handleChange}
              />
            </label>
          </div>
          <div className="form-group">
            <div>Password</div>
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
  user_id: 1,
  log_message: '',
  authenticated: state.authentication.authenticated,
  name: state.authentication.username,
  sessionToken: state.authentication.sessionToken,
  error: state.authentication.error,
});

const mapDispatchToProps: DispatchProps = {
  authenticate,
  historyPush: push,
  logClick,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login);

/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { push } from 'connected-react-router';
import { RootState } from '../reducers/rootReducer';
import { authenticate, authenticated } from '../contexts/authentication';
import Header from '../components/Header';
import { logClick } from '../contexts/LogClicks';

interface StateProps {
  username: string;
  password: string;
  log_message: string;
  isAuthenticated: boolean;
  name: string;
  sessionToken: string;
  error: string;
  user_id: number;
}

interface DispatchProps {
  authenticated: () => boolean;
  authenticate: (username: string, password: string) => void;
  historyPush: (url: string) => void;
  logClick: (log_message: string, user_id: number) => any;
}

const Login = (props: StateProps & DispatchProps): JSX.Element => {
  // state
  const [state, setState] = React.useState(props);
  const { username, password } = state;

  const history = useHistory();

  // props
  const {
    error,
    user_id,
    // eslint-disable-next-line no-shadow
    isAuthenticated,
  } = props;

  // update state on change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  // eslint-disable-next-line consistent-return
  const handleLoginClick = (): any => {
    // eslint-disable-next-line no-shadow
    props.authenticate(username, password);
  };

  const handleLog = (): any => {
    const { logClick } = props;
    logClick('Clicked Login', user_id);
  };
  // eslint-disable-next-line no-alert
  if (isAuthenticated) {
    handleLog();
    return <Redirect push to="/" />;
  }

  return (
    <div>
      <Header />
      <div className="form-container">
        <form
          onSubmit={(e): void => {
            e.preventDefault();
            handleLoginClick();
            history.push('/');
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
              <input type="text" name="username" value={username} onChange={handleChange} />
            </label>
          </div>
          <div className="form-group">
            <div>Password</div>
            <input type="password" name="password" value={password} onChange={handleChange} />
          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  username: '',
  password: '',
  user_id: state.authentication.user_id,
  log_message: '',
  isAuthenticated: authenticated(),
  name: state.authentication.username,
  sessionToken: state.authentication.sessionToken,
  error: state.authentication.error,
});

const mapDispatchToProps: DispatchProps = {
  authenticated,
  authenticate,
  historyPush: push,
  logClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

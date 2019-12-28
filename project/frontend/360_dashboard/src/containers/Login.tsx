/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { push } from 'connected-react-router';
import { makeStyles } from '@material-ui/core/styles';
import PersonIcon from '@material-ui/icons/Person';
import { RootState } from '../reducers/rootReducer';
import { authenticate, authenticated } from '../contexts/authentication';
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

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      width: 200,
    },
  },

  textInput: {
    display: 'flex',
    justifyContent: 'center',
  },

  iconStyle: {
    marginTop: '3rem',
    marginBottom: '1rem',
    height: '3rem',
    width: '3rem',
    color: '#04A777',
    zIndex: 1,
  },

  loginButton: {
    marginTop: '3rem',
    height: '2.5rem',
    width: '6rem',
    border: 'none',
    background: '#04A777',
    color: '#ffffff',
    borderRadius: '5px',
  },

  loginHeader: {
    backgroundColor: '#212121',
    height: '4rem',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#04A777',
  },

  loginBox: {
    backgroundColor: '#212121',
    margin: 'auto',
    marginTop: '10rem',
    width: '25rem',
    height: '28rem',
    border: '1px solid grey',
    borderRadius: '15px',
    zIndex: 1,
  },

  invalid: {
    color: '#FFFFFF',
  },

  loginTextfield: {
    marginTop: '2rem',
    background: 'transparent',
    outline: 0,
    borderWidth: '0 0 1px',
    borderColor: 'grey',
    color: '#FFFFFF',
  },

}));

const Login = (props: StateProps & DispatchProps): JSX.Element => {
  // state
  const [state, setState] = React.useState(props);
  const { username, password } = state;
  const classes = useStyles();
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
      <header className={classes.loginHeader}> Skeye 360 </header>
      <div className="background-style">
        <div className={classes.loginBox}>
            <div className={classes.textInput}>
              <PersonIcon className={classes.iconStyle}/>
            </div>
            <form
              onSubmit={(e): void => {
                e.preventDefault();
                handleLoginClick();
                history.push('/');
              }}
            >
            {error !== '' ? (
              <div className="form-group">
                <div className={classes.invalid}>{error}</div>
                </div>
            ) : (
              <div />
            )}
            <div className="form-group">
              <input type="text" name="username" className={classes.loginTextfield} placeholder="Username" value={username} onChange={handleChange} />
            </div>
              <div className="form-group">
              <input type="password" name="password" className={classes.loginTextfield} placeholder="Password" value={password} onChange={handleChange} />
            </div>
              <div className="form-group">
              <button className={classes.loginButton} type="submit">Login</button>
            </div>
            </form>
        </div>
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

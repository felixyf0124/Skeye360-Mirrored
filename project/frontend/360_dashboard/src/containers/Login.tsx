/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { push } from 'connected-react-router';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import PersonIcon from '@material-ui/icons/Person';
import LockIcon from '@material-ui/icons/Lock';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { RootState } from '../reducers/rootReducer';
import {
  authenticate,
  authenticated,
  getUserData,
  GetUserDataAction,
} from '../contexts/authentication';
import { logClick } from '../contexts/LogClicks';

interface StateProps {
  username: any;
  password: any;
  log_message: string;
  isAuthenticated: boolean;
  name: string;
  sessionToken: string;
  error: string;
  user_id: number;
  remMe: any;
}

interface DispatchProps {
  authenticated: (state: any) => boolean;
  authenticate: (username: string, password: string) => void;
  historyPush: (url: string) => void;
  logClick: (log_message: string, user_id: number) => any;
  getUserData: () => GetUserDataAction;
}

const loginTheme = createMuiTheme({
  palette: {
    primary: {
      main: '#808080',
    },
    secondary: {
      main: '#808080',
    },
  },
  overrides: {
    MuiInput: {
      underline: {
        '&:before': {
          borderBottom: '1px solid grey',
        },
        '&:hover:not($disabled):before': {
          borderBottom: '1px solid grey',
        },
      },
    },
    MuiInputLabel: {
      root: {
        color: 'grey',
      },
    },
    MuiFormLabel: {
      root: {
        color: 'grey',
      },
    },
    MuiInputBase: {
      root: {
        color: 'white',
      },
    },
    MuiGrid: {
      item: {
        color: 'grey',
      },
      container: {
        paddingBottom: '2rem',
      },
    },
  },
});

const useStyles = makeStyles(() => ({
  margin: {
    margin: loginTheme.spacing(1),
    paddingBottom: '3rem',
  },

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
    color: 'grey',
  },

  loginButton: {
    marginLeft: '0.5rem',
    marginTop: '1rem',
    height: '2.5rem',
    width: '13rem',
    border: 'none',
    background: '#04A777',
    color: '#ffffff',
    borderRadius: '5px',
  },

  loginHeader: {
    backgroundColor: '#212121',
    height: '6rem',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#04A777',
  },

  loginBox: {
    backgroundColor: '#212121',
    margin: 'auto',
    marginTop: '2rem',
    width: '22rem',
    height: '29rem',
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

  headerText: {
    color: '#04A777',
    fontSize: '2rem',
    fontFamily: 'roboto',
    marginTop: '3rem',
    marginBottom: '2rem',
  },

  checkBox: {
    color: 'grey',
    fontSize: '0.8rem',
    display: 'inline',
    justifyContent: 'center',
    verticalAlign: 'middle',
    paddingLeft: '0.5rem',
  },

  texts: {
    fontSize: '0.8rem',
    color: 'grey',
    verticalAlign: 'middle',
    font: 'roboto',
  },
}));

const Logo = styled.img`
  height: 5rem;
  width: 5rem;
  position: relative;
`;

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
    const input = e.target;
    const value = input.type === 'checkbox' ? input.checked : input.value;

    setState({ ...state, [input.name]: value });
  };

  // eslint-disable-next-line consistent-return
  const handleLoginClick = (): any => {
    if (state.remMe) {
      localStorage.setItem('remMe', state.remMe);
      localStorage.setItem('username', state.username);
      localStorage.setItem('password', state.password);
    } else {
      localStorage.removeItem('remMe');
      localStorage.removeItem('username');
      localStorage.removeItem('password');
    }
    // eslint-disable-next-line no-shadow
    props.authenticate(username, password);
  };

  const handleLog = (): any => {
    const { logClick } = props;
    logClick('Clicked Login', user_id);
  };

  const loadUserData = (): any => {
    const { getUserData } = props;
    getUserData();
  };

  loadUserData();
  // eslint-disable-next-line no-alert
  if (isAuthenticated) {
    handleLog();
    return <Redirect push to="/" />;
  }

  return (
    <ThemeProvider theme={loginTheme}>
      <div>
        <header className={classes.loginHeader}>
          <Logo src="/emblem.png" alt="LOGO" />
        </header>
        <div className="background-style">
          <div className={classes.loginBox}>
            <div className={classes.textInput}>
              <h1 className={classes.headerText}> Sign in </h1>
            </div>
            <form
              onSubmit={(e): void => {
                e.preventDefault();
                handleLoginClick();
                history.push('/');
              }}
            >
              {error !== '' ? (
                <div className="classes.margin">
                  <div className={classes.invalid}>{error}</div>
                </div>
              ) : (
                <div />
              )}
              <div className="classes.margin">
                <Grid container spacing={1} alignItems="flex-end" justify="center">
                  <Grid item>
                    <PersonIcon />
                  </Grid>
                  <Grid item>
                    <TextField
                      name="username"
                      label="Usename"
                      color="secondary"
                      value={state.username}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </div>
              <div className="classes.margin">
                <Grid container spacing={1} alignItems="flex-end" justify="center">
                  <Grid item>
                    <LockIcon />
                  </Grid>
                  <Grid item>
                    <TextField
                      name="password"
                      label="Password"
                      color="secondary"
                      type="password"
                      value={state.password}
                      onChange={handleChange}
                    />
                  </Grid>
                </Grid>
              </div>
              <div className="form-group">
                <div>
                  <input
                    name="remMe"
                    checked={state.remMe}
                    onChange={handleChange}
                    type="checkbox"
                    value=""
                    style={{ height: '1rem', width: '1rem', verticalAlign: 'middle' }}
                  />
                  <div className={classes.checkBox}>Remember me</div>
                </div>
              </div>
              <div className="form-group">
                <button className={classes.loginButton} type="submit">
                  Login
                </button>
              </div>
              <div>
                <p className={classes.texts} style={{ textAlign: 'center' }}>
                  Don&apos;t have an account?
                  <a style={{ color: 'white', paddingLeft: '0.25rem' }} href="/register">
                    Sign up
                  </a>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  ...state,
  username: localStorage.getItem('username'),
  password: localStorage.getItem('password'),
  user_id: state.authentication.user_id,
  log_message: '',
  isAuthenticated: authenticated(state),
  name: state.authentication.username,
  sessionToken: state.authentication.sessionToken,
  error: state.authentication.error,
  remMe: localStorage.getItem('remMe'),
});

const mapDispatchToProps: DispatchProps = {
  authenticated,
  authenticate,
  historyPush: push,
  logClick,
  getUserData,
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { push } from 'connected-react-router';
import { makeStyles, createMuiTheme, ThemeProvider } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import PersonIcon from '@material-ui/icons/Person';
import EmailIcon from '@material-ui/icons/Email';
import LockIcon from '@material-ui/icons/Lock';
import styled from 'styled-components';
import TextField from '@material-ui/core/TextField';
import { RootState } from '../reducers/rootReducer';
import {
  register, registered, getUserData, GetUserDataAction,
} from '../contexts/register';
import { SKEYE_RED } from '../css/custom';

const Error = styled.h6`
  color: ${SKEYE_RED};
  text-align: center;
`;

interface StateProps {
  username: any;
  password: any;
  password2: any;
  email: any;
  isRegistered: boolean;
  is_staff: boolean;
  log_message: string;
  sessionToken: string;
  error: string;
}

interface DispatchProps {
  registered: (state: any) => boolean;
  register: (
    username: string,
    password: string,
    email: string,
    is_staff: boolean,
  ) => void;
  historyPush: (url: string) => void;
  getUserData: () => GetUserDataAction;
  // logClick: (log_message: string, user_id: number) => any;
}

const registerTheme = createMuiTheme({
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
    margin: registerTheme.spacing(1),
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

  registerButton: {
    marginLeft: '0.5rem',
    marginTop: '1rem',
    height: '2.5rem',
    width: '13rem',
    border: 'none',
    background: '#04A777',
    color: '#ffffff',
    borderRadius: '5px',
  },

  registerHeader: {
    backgroundColor: '#212121',
    height: '6rem',
    fontSize: '1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#04A777',
  },

  registerBox: {
    backgroundColor: '#212121',
    margin: 'auto',
    marginTop: '8rem',
    width: '25rem',
    height: '39rem',
    border: '1px solid grey',
    borderRadius: '15px',
    zIndex: 1,
  },

  invalid: {
    color: '#FFFFFF',
  },

  registerTextfield: {
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

const Register = (props: StateProps & DispatchProps): JSX.Element => {
  const [state, setState] = React.useState(props);
  const {
    username, password, password2, email, is_staff,
  } = state;
  const classes = useStyles();
  const history = useHistory();

  // props
  const {
    error,
    // eslint-disable-next-line no-shadow
    isRegistered,
  } = props;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  // eslint-disable-next-line consistent-return
  const handleSubmit = (): any => {
    if (password !== password2) {
      alert('passwords not matching');
      return <Redirect to="/register" />;
    }
    props.register(
      username,
      password,
      email,
      is_staff,
    );
  };

  if (isRegistered) {
    alert('Success! Please login.');
    return <Redirect to="/login" />;
  }
  return (
    <ThemeProvider theme={registerTheme}>
      <div>
        <header className={classes.registerHeader}>
          <Logo src="/emblem.png" alt="LOGO" />
        </header>
        <div className="background-style">
          <div className={classes.registerBox}>
            <div className={classes.textInput}>
              <h1 className={classes.headerText}> Register </h1>
            </div>
            <form
              onSubmit={(e): void => {
                e.preventDefault();
                handleSubmit();
              }}
            >
              {error !== '' ? <Error>{error}</Error> : <div />}
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
                      required
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
                      required
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
                      name="password2"
                      label="Repeat password"
                      color="secondary"
                      type="password"
                      value={state.password2}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </Grid>
              </div>
              <div className="classes.margin">
                <Grid container spacing={1} alignItems="flex-end" justify="center">
                  <Grid item>
                    <EmailIcon />
                  </Grid>
                  <Grid item>
                    <TextField
                      name="email"
                      label="Email"
                      color="secondary"
                      type="email"
                      value={state.email}
                      onChange={handleChange}
                      required
                    />
                  </Grid>
                </Grid>
              </div>
              <div className="form-group">
                <div>
                  <input name="is_staff" checked={state.is_staff} onChange={handleChange} type="checkbox" style={{ height: '1rem', width: '1rem', verticalAlign: 'middle' }} />
                  <div className={classes.checkBox}>Register as Admin</div>
                </div>
              </div>
              <div className="form-group">
                <button className={classes.registerButton} type="submit">
                  Register
                </button>
              </div>
              <div>
                <p className={classes.texts} style={{ textAlign: 'center' }}>
                  Already have an account?
                  <a style={{ color: 'white', paddingLeft: '0.25rem' }} href="/login">
                    Login
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
  password2: localStorage.getItem('password2'),
  email: localStorage.getItem('email'),
  sessionToken: '',
  log_message: '',
  is_staff: false,
  isRegistered: registered(state),
  error: state.register.error,
});


const mapDispatchToProps: DispatchProps = {
  historyPush: push,
  register,
  registered,
  getUserData,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Register);

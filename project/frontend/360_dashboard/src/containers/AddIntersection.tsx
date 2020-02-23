/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import styled from 'styled-components';
import { push } from 'connected-react-router';
import { makeStyles, createMuiTheme } from '@material-ui/core/styles';
import Dialog from '@material-ui/core/Dialog';

import { ThemeProvider } from '@material-ui/styles';
import DialogContent from '@material-ui/core/DialogContent';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import AddIcon from '@material-ui/icons/Add';
import { RootState } from '../reducers/rootReducer';
import { addNewIntersection } from '../contexts/intersection';
import { logClick } from '../contexts/LogClicks';

const Body = styled.div`
  overflow-y: none;
`;

interface StateProps {
  path: string;
  username: string;

  latitude: string;
  longitude: string;
  intersection_name: string;
  district_id: string;

  error: string;
  user_id: number;
}

interface DispatchProps {
  historyPush: (url: string) => void;
  addNewIntersection: (
    intersection_name: string,
    latitude: string,
    longitude: string,
    district_id: string,
  ) => any;
  logClick: (log_message: string, user_id: number) => any;
}

const useStyles = makeStyles(() => ({
  root: {
    '& > *': {
      width: 200,
    },
  },

  centeredBox: {
    display: 'flex',
    justifyContent: 'center',
  },

  textEntry: {
    color: '#FFFFFF',
    marginBottom: '0rem',
  },

  addButton: {
    marginTop: '1em',
    height: '2.5rem',
    width: '6rem',
    border: 'none',
    background: '#04A777',
    color: '#ffffff',
    borderRadius: '5px',
  },

  content: {
    backgroundColor: '#212121',
    margin: 'auto',
    width: '25rem',
    height: '30rem',
    border: '1px solid grey',
    borderRadius: '15px',
    zIndex: 1,
  },

  invalid: {
    color: '#FFFFFF',
  },

  textField: {
    marginTop: '1rem',
    marginBottom: '1rem',
    background: 'transparent',
    outline: 0,
    borderWidth: '0 0 1px',
    borderColor: 'grey',
    color: '#FFFFFF',
  },

  innerBox: {
    marginTop: '2rem',
  },
}));

const addIntTheme = createMuiTheme({
  overrides: {
    MuiDialogContent: {
      root: {
        padding: 'none',
        margin: 'none',
        backgroundColor: 'transparent',
        boxShadow: 'none',
        paddingTop: '0px',
        borderRadius: '15px',
        '&:first-child': {
          paddingTop: '0px',
          borderRadius: '15px',
        },
      },
    },
    MuiButtonBase: {
      root: {
        '&:focus': {
          outline: 'none',
        },
      },
    },
    MuiDialog: {
      paper: {
        borderRadius: '15px',
      },
    },
  },
});

const AddIntersection = (props: StateProps & DispatchProps): JSX.Element => {
  const [state, setState] = React.useState(props);
  const {
    latitude, longitude, intersection_name, district_id, error,
  } = state;

  const { user_id } = props;

  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  // eslint-disable-next-line consistent-return
  const handleSubmit = (): any => {
    const { logClick } = props;
    props.addNewIntersection(
      state.intersection_name,
      state.latitude,
      state.longitude,
      state.district_id,
    );
    logClick('Added Intersection', user_id);
  };

  const title = 'Add Intersection';
  const classes = useStyles();

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={addIntTheme}>
      <Body>
        <div>
          <IconButton style={{ color: 'white', backgroundColor: '#04A777', marginTop: '1rem' }} onClick={handleClickOpen}>
            <AddIcon />
          </IconButton>
          <Dialog
            open={open}
            onClose={handleClose}
          >
            <DialogContent>
              <div className={classes.content}>
                {error !== '' ? (
                  <div className="form-group">
                    <div className={classes.invalid}>{error}</div>
                  </div>
                ) : (
                  <div />
                )}
                <form
                  onSubmit={(e): void => {
                    e.preventDefault();
                    handleSubmit();
                    history.push('/');
                  }}
                >
                  <div className={classes.innerBox}>
                    <div style={{ float: 'right', marginTop: '-1.5rem' }}>
                      <IconButton onClick={handleClose} style={{ float: 'right' }}>
                        <CloseIcon />
                      </IconButton>
                    </div>
                    <div className="form-group" style={{ paddingLeft: '3rem' }}>
                      <div className={classes.textEntry}>District ID</div>
                      <input
                        type="text"
                        name="district_id"
                        value={district_id}
                        className={classes.textField}
                        disabled
                      />
                    </div>
                    <div className="form-group">
                      <div className={classes.textEntry}>Intersection Name</div>
                      <input
                        type="text"
                        name="intersection_name"
                        value={intersection_name}
                        placeholder="e.g. Guy/St-Catherine"
                        className={classes.textField}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <div className={classes.textEntry}>Latitude</div>
                      <input
                        type="text"
                        name="latitude"
                        value={latitude}
                        placeholder="e.g. 12.3456"
                        className={classes.textField}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="form-group">
                      <div className={classes.textEntry}>Longitude</div>
                      <input
                        type="text"
                        name="longitude"
                        value={longitude}
                        placeholder="e.g. 12.3456"
                        className={classes.textField}
                        onChange={handleChange}
                      />
                    </div>
                    <div className={classes.centeredBox}>
                      <button className={classes.addButton} onClick={handleClose} type="submit">Add</button>
                    </div>
                  </div>
                </form>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Body>
    </ThemeProvider>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  path: '/intersection/add',
  username: state.authentication.username,

  latitude: '',
  longitude: '',
  district_id: '1',
  intersection_name: '',

  error: state.intersection.error,
  user_id: state.authentication.user_id,
});

const mapDispatchToProps: DispatchProps = {
  historyPush: push,
  addNewIntersection,
  logClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddIntersection);

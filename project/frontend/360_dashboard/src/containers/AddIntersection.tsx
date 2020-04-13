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
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { RootState } from '../reducers/rootReducer';
import { addNewIntersection } from '../contexts/intersection';
import { logClick } from '../contexts/logClicks';
import { STATE as userState } from '../contexts/users';
import { SKEYE_GREY, MOBILE_DEVICE_MAX_WIDTH } from '../css/custom';

const Body = styled.div`
  @media only screen and (min-width: ${MOBILE_DEVICE_MAX_WIDTH}px) {
    & {
      overflow-y: none;
    }
  }
`;

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

  dropdownMenu: {
    width: '100%',
    maxWidth: 360,
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
    width: '20rem',
    height: '45rem',
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

// Passed Props
interface Props {
  users: userState;
}

// StateProps
interface StateProps {
  path: string;
  username: string;

  latitude: string;
  longitude: string;
  intersection_name: string;
  district_id: string;
  assigned_user_id: string;

  error: string;
  user_id: number;
}

// DispatchProps
interface DispatchProps {
  addNewIntersection: (
    intersection_name: string,
    latitude: string,
    longitude: string,
    district_id: string,
    user_id: string,
  ) => any;
  historyPush: (url: string) => void;
  logClick: (log_message: string, user_id: number) => any;
}

// Component
const AddIntersection = (props: Props & StateProps & DispatchProps): JSX.Element => {
  const [state, setState] = React.useState(props);
  const {
    district_id, intersection_name, latitude, longitude, error,
  } = state;

  const { user_id, users } = props;
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
      String(state.assigned_user_id),
    );
    logClick(
      `Added Intersection: ${state.intersection_name}, ${state.latitude}, ${state.longitude}, ${state.district_id}, ${state.assigned_user_id}`,
      user_id,
    );
  };

  const classes = useStyles();

  // Hovering AddIntersection Form
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  // User List Dropdown List
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
    assigned_user_id: string,
  ): void => {
    setSelectedIndex(index);
    setAnchorEl(null);
    setState({ ...state, assigned_user_id });
  };

  const handleAnchorClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={addIntTheme}>
      <Body>
        <div>
          <IconButton
            style={{ color: 'white', backgroundColor: '#04A777', marginTop: '1rem' }}
            onClick={handleClickOpen}
          >
            <AddIcon />
          </IconButton>
          <Dialog open={open} onClose={handleClose}>
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
                    <div
                      className="form-group"
                      style={{ paddingLeft: '3rem', justifyContent: 'center' }}
                    >
                      <h6 style={{ color: '#FFFFFF' }}>Add Intersection</h6>
                    </div>
                    <div className="form-group">
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
                    {/* Dropdown Menu for user list */}
                    <div className="form-group">
                      <div className={classes.dropdownMenu}>
                        <List component="nav" aria-label="User List">
                          <ListItem
                            button
                            aria-haspopup="true"
                            aria-controls="lock-menu"
                            aria-label="Assigned Operator"
                            onClick={handleClickListItem}
                            style={{
                              backgroundColor: `${SKEYE_GREY}`, width: 'fit-content', color: 'black', borderRadius: '5px', paddingTop: 0, paddingBottom: 0,
                            }}
                          >
                            <ListItemText
                              primary="Assigned Operator"
                              secondary={`${users[0][selectedIndex].id} - ${users[0][selectedIndex].username}`}
                            />
                          </ListItem>
                        </List>
                        <Menu
                          id="assigned_user_id"
                          anchorEl={anchorEl}
                          keepMounted
                          open={Boolean(anchorEl)}
                          onClose={handleAnchorClose}
                        >
                          {users[0].map((user: any, index: number) => (
                            <MenuItem
                              key={user.id}
                              selected={index === selectedIndex}
                              onClick={(event): void => handleMenuItemClick(event, index, user.id)}
                            >
                              {`${user.id} - ${user.username}`}
                            </MenuItem>
                          ))}
                        </Menu>
                      </div>
                    </div>
                    {/* Submit Button */}
                    <div className={classes.centeredBox}>
                      <button className={classes.addButton} onClick={handleClose} type="submit">
                        Add
                      </button>
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

  district_id: '1',
  intersection_name: '',
  latitude: '',
  longitude: '',
  assigned_user_id: '',

  error: state.intersection.error,
  user_id: state.authentication.user_id,
});

const mapDispatchToProps: DispatchProps = {
  addNewIntersection,
  historyPush: push,
  logClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(AddIntersection);

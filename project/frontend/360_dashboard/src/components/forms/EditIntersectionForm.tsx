/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { editExistingIntersection, EditIntersectionAction } from '../../contexts/intersection';
import { RootState } from '../../reducers/rootReducer';
import { logClick } from '../../contexts/LogClicks';
import { getUsers, STATE as userState } from '../../contexts/users';
import { SKEYE_GREY } from '../../css/custom';

const useStyles = makeStyles(() => ({
  root: {
    '& > *': {
      width: 200,
    },
  },

  dropdownMenu: {
    width: '100%',
    maxWidth: 360,
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
    marginBottom: '2rem',
    width: '25rem',
    height: '40rem',
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

// Props
interface Props {
  users: userState;
}

// State Props
interface StateProps {
  intersection_id: string;
  latitude: string;
  longitude: string;
  intersection_name: string;
  district_id: string;
  assigned_user_id: number;
  error: string;
  user_id: number;
}

// Dispatch Props
interface DispatchProps {
  editExistingIntersection: (
    intersection_id: string,
    intersection_name: string,
    latitude: string,
    longitude: string,
    district_id: string,
    assigned_user_id: string,
  ) => EditIntersectionAction;
  getUsers: (userType: string) => any;
  logClick: (log_message: string, user_id: number) => any;
}

const EditIntersectionForm = (props: Props & StateProps & DispatchProps): JSX.Element => {
  const [state, setState] = React.useState(props);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const { user_id, users } = props;

  const history = useHistory();

  const handleSubmit = (): void => {
    // const { logClick } = props;
    props.editExistingIntersection(
      state.intersection_id,
      state.intersection_name,
      state.latitude,
      state.longitude,
      state.district_id,
      String(state.assigned_user_id),
    );
    props.logClick('Edited Intersection', user_id);
  };

  const classes = useStyles();

  // User List Dropdown List
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  let assignedUser = users[0].findIndex((x) => x.id === state.assigned_user_id);
  if (assignedUser === -1) {
    assignedUser = 0;
  }
  const [selectedIndex, setSelectedIndex] = React.useState(assignedUser);

  const handleClickListItem = (event: React.MouseEvent<HTMLElement>): void => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLElement>,
    index: number,
    assigned_user_id: number,
  ): void => {
    setSelectedIndex(index);
    setAnchorEl(null);
    setState({ ...state, assigned_user_id });
  };

  const handleAnchorClose = (): void => {
    setAnchorEl(null);
  };

  return (
    <div>
      <div className={classes.content}>
        {state.error !== '' ? (
          <div className="form-group">
            <div className={classes.invalid}>{state.error}</div>
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
          <div className="form-group" style={{ justifyContent: 'center', marginTop: '1rem' }}>
            <h6 style={{ color: '#FFFFFF' }}>Edit Intersection</h6>
          </div>
          <div className={classes.innerBox}>
            <div className="form-group">
              <div className={classes.textEntry}>District ID</div>
              <input
                type="text"
                className={classes.textField}
                name="district_id"
                value={state.district_id}
                disabled
              />
            </div>
            <div className="form-group">
              <div className={classes.textEntry}>Intersection Name</div>
              <input
                type="text"
                name="intersection_name"
                value={state.intersection_name}
                className={classes.textField}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <div className={classes.textEntry}>Latitude</div>
              <input
                type="text"
                name="latitude"
                className={classes.textField}
                value={state.latitude}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <div className={classes.textEntry}>Longitude</div>
              <input
                type="text"
                name="longitude"
                className={classes.textField}
                value={state.longitude}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <div className={classes.dropdownMenu}>
                <List component="nav" aria-label="User List">
                  <ListItem
                    button
                    aria-haspopup="true"
                    aria-controls="lock-menu"
                    aria-label="Assigned Operator"
                    onClick={handleClickListItem}
                    style={{backgroundColor: `${SKEYE_GREY}`, width: 'fit-content', marginLeft: '1rem', color: 'black', borderRadius: '5px', paddingTop: 0, paddingBottom: 0}}
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
            <div className={classes.centeredBox}>
              <button className={classes.addButton} type="submit">
                Edit
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  district_id: state.intersection.district_id,
  intersection_id: state.intersection.intersection_id,
  latitude: state.intersection.latitude,
  longitude: state.intersection.longitude,
  intersection_name: state.intersection.intersection_name,
  assigned_user_id: state.intersection.user_id,
  error: state.intersection.error,
  user_id: state.authentication.user_id,
});

const mapDispatchToProps: DispatchProps = {
  editExistingIntersection,
  getUsers,
  logClick,
};

export default connect(mapStateToProps, mapDispatchToProps)(EditIntersectionForm);

/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { push } from 'connected-react-router';
import { makeStyles } from '@material-ui/core/styles';
import SideDrawer from '../components/SideDrawer';
import { RootState } from '../reducers/rootReducer';
import { addNewIntersection } from '../contexts/intersection';
import { logClick } from '../contexts/LogClicks';

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
  logClick: (
    log_message: string,
    user_id: number,
  ) => any;
}

const useStyles = makeStyles((theme) => ({
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
    marginTop: '20rem',
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

  return (
    <div>
      <SideDrawer
        headerTitle={title}
      />
      <div className={classes.content}>

        {error !== '' ? (
          <div className="form-group">
            <div className={classes.invalid}>{error}</div>
          </div>
        ) : (
          <div />
        )}
        <form onSubmit={(e): void => {
          e.preventDefault();
          handleSubmit();
          history.push('/');
        }}
        >
          <div className={classes.innerBox}>
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
                className={classes.textField}
                onChange={handleChange}
              />
            </div>
            <div className={classes.centeredBox}>
              <button className={classes.addButton} type="submit">Add</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  path: '/intersection/add',
  username: state.authentication.username,

  latitude: '45.5017',
  longitude: '-73.5673',
  district_id: '1',
  intersection_name: 'Guy St/St-Cath',

  error: state.intersection.error,
  user_id: state.authentication.user_id,
});

const mapDispatchToProps: DispatchProps = {
  historyPush: push,
  addNewIntersection,
  logClick,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddIntersection);

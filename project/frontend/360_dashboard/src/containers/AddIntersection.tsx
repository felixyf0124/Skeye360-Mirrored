/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import { push } from 'connected-react-router';
import Header from '../components/Header';
import { RootState } from '../reducers/rootReducer';
import { addNewIntersection } from '../contexts/intersection';

interface StateProps {
    path: string;
    authenticated: boolean;
    username: string;

    latitude: string;
    longitude: string;
    intersection_name: string;
    district_id: string;

    error: string;
}

interface DispatchProps {
  historyPush: (url: string) => void;
  addNewIntersection: (
    intersection_name: string,
    latitude: string,
    longitude: string,
    district_id: string,
  ) => any;
}

const AddIntersection = (props: StateProps & DispatchProps): JSX.Element => {
  const [state, setState] = React.useState(props);
  const {
    latitude, longitude, intersection_name, district_id, error,
  } = state;

  const history = useHistory();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  // eslint-disable-next-line consistent-return
  const handleSubmit = (): any => {
    props.addNewIntersection(
      state.intersection_name,
      state.latitude,
      state.longitude,
      state.district_id,
    );
  };

  if (!state.authenticated) return <Redirect push to="/login" />;

  return (
    <div>
      <Header />
      <div className="form-container">
        {error !== '' ? (
          <div className="form-group">
            <div>{error}</div>
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
          <div className="form-group">
            <div>District ID</div>
            <input
              type="text"
              name="district_id"
              value={district_id}
              disabled
            />
          </div>
          <div className="form-group">
            <div>Intersection Name</div>
            <input
              type="text"
              name="intersection_name"
              value={intersection_name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <div>Latitude</div>
            <input
              type="text"
              name="latitude"
              value={latitude}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <div>Longitude</div>
            <input
              type="text"
              name="longitude"
              value={longitude}
              onChange={handleChange}
            />
          </div>
          <button type="submit">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  path: '/intersection/add',
  authenticated: state.authentication.authenticated,
  username: state.authentication.username,

  latitude: '45.5017',
  longitude: '-73.5673',
  district_id: '1',
  intersection_name: 'Guy St/St-Cath',

  error: state.intersection.error,
});

const mapDispatchToProps: DispatchProps = {
  historyPush: push,
  addNewIntersection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AddIntersection);

/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { useHistory } from 'react-router-dom';
import { connect } from 'react-redux';
import { editExistingIntersection, EditIntersectionAction } from '../contexts/intersection';
import { RootState } from '../reducers/rootReducer';

interface Props {
  intersection_id: string;
  latitude: string;
  longitude: string;
  intersection_name: string;
  district_id: string;
}

interface StateProps {
  error: string;
}

interface DispatchProps {
  editExistingIntersection: (
    intersection_id: string,
    intersection_name: string,
    latitude: string,
    longitude: string,
    district_id: string,
  ) => EditIntersectionAction;
}

const EditIntersectionForm = (props: Props & StateProps & DispatchProps): JSX.Element => {
  const [state, setState] = React.useState(props);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const history = useHistory();

  const handleSubmit = (): void => {
    props.editExistingIntersection(
      state.intersection_id,
      state.intersection_name,
      state.latitude,
      state.longitude,
      state.district_id,
    );
  };

  return (
    <div>
      <div className="form-container">
        {state.error !== '' ? (
          <div className="form-group">
            <div>{state.error}</div>
          </div>
        ) : (
          <div />
        )}
        <form onSubmit={(e): void => {
          e.preventDefault();
          handleSubmit();
          history.push(`/streetview/${state.intersection_id}`);
        }}
        >
          <div className="form-group">
            <div>District ID</div>
            <input
              type="text"
              name="district_id"
              value={state.district_id}
              disabled
            />
          </div>
          <div className="form-group">
            <div>Intersection Name</div>
            <input
              type="text"
              name="intersection_name"
              value={state.intersection_name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <div>Latitude</div>
            <input
              type="text"
              name="latitude"
              value={state.latitude}
              onChange={handleChange}
            />
          </div>
          <div className="form-group">
            <div>Longitude</div>
            <input
              type="text"
              name="longitude"
              value={state.longitude}
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
  error: state.intersection.error,
});

const mapDispatchToProps: DispatchProps = {
  editExistingIntersection,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EditIntersectionForm);

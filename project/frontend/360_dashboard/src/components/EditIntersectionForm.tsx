/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { editNewIntersection } from '../contexts/intersection';

interface Props {
    latitude: string;
    longitude: string;
    intersection_name: string;
    district_id: string;
    error: string;
}

// interface DispatchProps {
//   editNewIntersection
// }

const EditIntersection = (props: Props): JSX.Element => {
  const [state, setState] = React.useState(props);
  const {
    latitude, longitude, intersection_name, district_id, error,
  } = state;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setState({ ...state, [e.target.name]: e.target.value });
  };

  const handleSubmit = (): void => {
    editNewIntersection(
      state.intersection_name,
      state.latitude,
      state.longitude,
      state.district_id,
    );
  };

  return (
    <div>
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

export default EditIntersection;

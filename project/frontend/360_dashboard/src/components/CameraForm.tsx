/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';

const CameraForm = (props: {
    latitude: string;
    longitude: string;
    intersection_name: string;
    district_id: string;
    error: string;

    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: () => any;
}): JSX.Element => {
  const [state] = React.useState(props);
  const {
    intersection_name, latitude, longitude, district_id, error, handleChange, handleSubmit,
  } = state;

  return (
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
            onChange={handleChange}
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
  );
};

export default CameraForm;

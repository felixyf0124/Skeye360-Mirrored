/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';

const CameraForm = (props: {
    latitude: number;
    longitude: number;
    intersection_name: string;
    error: string;

    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: () => void;
}): JSX.Element => {
  const [state] = React.useState(props);
  const {
    intersection_name, latitude, longitude, error, handleChange, handleSubmit,
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
            value="1"
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

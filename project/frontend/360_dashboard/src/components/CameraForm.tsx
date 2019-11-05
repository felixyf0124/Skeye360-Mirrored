import React from 'react';

const CameraForm = (props: {
    city: string;
    lat: number;
    lng: number;
    cameraURL: string;
    street: string;
    error: string;

    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleSubmit: () => void;
}): JSX.Element => {
  const [state] = React.useState(props);
  const {
    city, lat, lng, cameraURL, street, error, handleChange, handleSubmit,
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
          <div>City</div>
          <input
            type="text"
            name="city"
            value={city}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <div>Latitude</div>
          <input
            type="text"
            name="lat"
            value={lat}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <div>Longitude</div>
          <input
            type="text"
            name="lng"
            value={lng}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <div>Camera URL</div>
          <input
            type="text"
            name="cameraURL"
            value={cameraURL}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <div>Street Intersection</div>
          <input
            type="text"
            name="street"
            value={street}
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

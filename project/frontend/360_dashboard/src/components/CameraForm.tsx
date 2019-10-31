import React from 'react';

const CameraForm = (props: {
    city: string,
    lat: number,
    lng: number,
    camera_url: string,
    street: string,
    error: string,

    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void,
    handleSubmit: () => void,
}): JSX.Element => {
    const [ state ] = React.useState(props);
    const { city, lat, lng, camera_url, street, error, handleChange, handleSubmit } = state;

    return (
      <div className="form-container">
          <form onSubmit={(e) => {
              e.preventDefault();
              handleSubmit();
          }}>
              {props.error !== '' ? (
                  <div className="form-group">
                      <label>{error}</label>
                  </div>
              ): (
                  <div />
              )}
              <div className="form-group">
                  <label>City</label>
                  <input
                      type="text"
                      name="city"
                      value={city}
                      onChange={handleChange}
                  />
              </div>
              <div className="form-group">
                  <label>Latitude</label>
                  <input
                      type="text"
                      name="lat"
                      value={lat}
                      onChange={handleChange}
                  />
              </div>
              <div className="form-group">
                  <label>Longitude</label>
                  <input
                      type="text"
                      name="lng"
                      value={lng}
                      onChange={handleChange}
                  />
              </div>
              <div className="form-group">
                  <label>Camera URL</label>
                  <input
                      type="text"
                      name="camera_url"
                      value={camera_url}
                      onChange={handleChange}
                  />
              </div>
              <div className="form-group">
                  <label>Street Intersection</label>
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
}

export default CameraForm;
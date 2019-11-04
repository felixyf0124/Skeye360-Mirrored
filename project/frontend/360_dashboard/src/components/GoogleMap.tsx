import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';
import Marker from './Marker';

const API_KEY = 'AIzaSyDF3Bsq5rm-uhEMAqqyMqzgc-dXUPl9Byw';

const GoogleMap = () => {
  const [center] = useState({ lat: 45.5017, lng: -73.5673 });
  const [zoom] = useState(11);

  return (
    <div style={{ height: '100vh', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key: API_KEY }}
        defaultCenter={center}
        defaultZoom={zoom}
      >
        <Marker
          lat={center.lat}
          lng={center.lng}
          text="Camera_id"
          color="red"
          link="streetview"
        />
      </GoogleMapReact>
    </div>
  );
};

export default connect()(GoogleMap);

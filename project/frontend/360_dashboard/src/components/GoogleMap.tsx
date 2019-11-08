/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';
import Marker from './Marker';
import { STATE as districtState } from '../contexts/districts';

const API_KEY = 'AIzaSyDF3Bsq5rm-uhEMAqqyMqzgc-dXUPl9Byw';

const GoogleMap = (districts: districtState): JSX.Element => {
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
          lat={districts.districts[0].intersections[0].latitude}
          lng={districts.districts[0].intersections[0].longitude}
          text="Camera_id"
          color="red"
          link="/streetview"
        />
        <Marker
          lat={districts.districts[1].intersections[0].latitude}
          lng={districts.districts[1].intersections[0].longitude}
          text="Camera_id"
          color="red"
          link="/streetview"
        />
      </GoogleMapReact>
    </div>
  );
};

export default connect()(GoogleMap);

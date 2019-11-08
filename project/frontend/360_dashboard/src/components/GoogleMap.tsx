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
        {districts.districts[0] === undefined ? (
          <Marker
            key={0}
            lat={0}
            lng={0}
            text="Camera_id"
            color="red"
            link="/streetview"
          />
        ) : (
          districts.districts[0].intersections.map((intersection) => (
            <Marker
              key={intersection.id}
              lat={intersection.latitude}
              lng={intersection.longitude}
              text="Camera_id"
              color="red"
              link="/streetview"
            />
          ))
        )}
      </GoogleMapReact>
    </div>
  );
};

export default connect()(GoogleMap);

/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';
import Marker from './Marker';

const API_KEY = 'AIzaSyDF3Bsq5rm-uhEMAqqyMqzgc-dXUPl9Byw';

interface Props {
  intersectionId: string;
  intersectionLat: string;
  intersectionLng: string;
}

const GoogleMap = (props: Props): JSX.Element => {
  const [state] = React.useState(props);
  const [center] = useState({
    lat: parseFloat(state.intersectionLat),
    lng: parseFloat(state.intersectionLng),
  });
  const [zoom] = useState(15);
  return (
    <GoogleMapReact bootstrapURLKeys={{ key: API_KEY }} defaultCenter={center} defaultZoom={zoom}>
      <Marker
        key={state.intersectionId}
        lat={state.intersectionLat}
        lng={state.intersectionLng}
        text="Camera_id"
        color="red"
        link={`/streetview/${state.intersectionId}`}
      />
    </GoogleMapReact>
  );
};

export default connect()(GoogleMap);

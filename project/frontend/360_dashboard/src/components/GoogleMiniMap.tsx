/* eslint-disable react/jsx-key */
import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';
import Marker from './Marker';

const API_KEY = 'AIzaSyDF3Bsq5rm-uhEMAqqyMqzgc-dXUPl9Byw';

// Props to be loaded
interface Props {
  intersectionId: string;
  intersectionLat: string;
  intersectionLng: string;
}

// GoogleMiniMap will intake all the Props above
const GoogleMiniMap = (props: Props): JSX.Element => {
  const [state] = React.useState(props);
  // minimap will be centered according to the intersection lat lng
  const [center] = useState({
    lat: parseFloat(state.intersectionLat),
    lng: parseFloat(state.intersectionLng),
  });
  // zoom 15 should be close enough. increase zoom if it's not close enough.
  const [zoom] = useState(15);
  // loads map with 1 marker.
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

export default connect()(GoogleMiniMap);

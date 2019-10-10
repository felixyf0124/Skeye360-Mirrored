// https://levelup.gitconnected.com/reactjs-google-maps-with-custom-marker-ece0c7d184c4

import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';

const API_KEY: string = "AIzaSyDF3Bsq5rm-uhEMAqqyMqzgc-dXUPl9Byw";

const SkeyeMap = (props: any) => {
    const [ center ] = useState({lat: 45.5017, lng: -73.5673 });
    const [ zoom ] = useState(11);

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
            link="https://www.w3schools.com"
          />
        </GoogleMapReact>
      </div>
    );
}

export default SkeyeMap;

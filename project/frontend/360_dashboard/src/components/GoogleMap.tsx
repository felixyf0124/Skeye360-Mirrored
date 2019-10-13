import React, { useState } from 'react';
import GoogleMapReact from 'google-map-react';
import Marker from './Marker';

const API_KEY: string = "AIzaSyDF3Bsq5rm-uhEMAqqyMqzgc-dXUPl9Byw";

const GoogleMap = (props: any) => {
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
            link="http://127.0.0.1:4000"
          />
        </GoogleMapReact>
      </div>
    );
}

export default GoogleMap;
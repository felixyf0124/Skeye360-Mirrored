/* eslint-disable react/jsx-key */
import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import { connect } from 'react-redux';
import CircularProgress from '@material-ui/core/CircularProgress';
import Marker from './Marker';
import { STATE as districtState } from '../contexts/districts';
import { RootState } from '../reducers/rootReducer';

const API_KEY = 'AIzaSyDF3Bsq5rm-uhEMAqqyMqzgc-dXUPl9Byw';

interface Props {
  districts: districtState;
  districtName: string;
}

interface StateProps {
  appZoom: number;
  districtLat: number;
  districtLng: number;
  defaultDistrictLat: number;
  defaultDistrictLng: number;
}

const GoogleMap = (props: Props & StateProps): JSX.Element => {
  const {
    appZoom,
    districts,
    districtName,
    districtLat,
    districtLng,
    defaultDistrictLat,
    defaultDistrictLng,
  } = props;
  const [center, setCenter] = useState({ lat: defaultDistrictLat, lng: defaultDistrictLng });
  const [zoom, setZoom] = useState(appZoom);
  const [layerTypes, setLayerTypes]: any = useState([]);

  useEffect(() => {
    if (districtLat !== center.lat || districtLng !== center.lng) {
      setCenter({ lat: districtLat, lng: districtLng });
    }
    if (zoom !== appZoom) {
      setZoom(appZoom);
    }
    if (appZoom !== 11) {
      setLayerTypes(['TrafficLayer', 'TransitLayer']);
    } else {
      setLayerTypes([]);
    }
  }, [districtLat, center.lat, center.lng, districtLng, zoom, appZoom]);

  return (
    <GoogleMapReact
      bootstrapURLKeys={{ key: API_KEY }}
      center={center}
      zoom={zoom}
      layerTypes={layerTypes}
    >
      {districts[districtName] === undefined ? (
        <CircularProgress />
      ) : (
        districts[districtName].intersections.map((intersection) => (
          <Marker
            key={intersection.id}
            name={intersection.intersection_name}
            lat={intersection.latitude}
            lng={intersection.longitude}
            text="Camera_id"
            color="red"
            link="/#map"
          />
        ))
      )}
    </GoogleMapReact>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  appZoom: state.app.zoom,
  districtLat: state.app.districtLat,
  districtLng: state.app.districtLng,
  defaultDistrictLat: state.app.defaultLat,
  defaultDistrictLng: state.app.defaultLng,
});

export default connect(mapStateToProps, {})(GoogleMap);

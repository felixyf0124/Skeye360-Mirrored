import React from 'react';
import { connect } from 'react-redux';
import '../css/Marker.css';
import { Link } from 'react-router-dom';
import { setDistrictCoord, SetCoordAction } from '../contexts/app';
import { RootState } from '../reducers/rootReducer';

interface Props {
  color: string;
  name: string;
  lat: number;
  lng: number;
  text: string;
  link: string;
}

interface StateProps {
  appZoom: number;
  districtLat: number;
  districtLng: number;
  defaultDistrictLat: number;
  defaultDistrictLng: number;
}

interface DispatchProps {
  setDistrictCoord: (lat: number, lng: number, zoom: number) => SetCoordAction;
}

const Marker = (props: (Props & StateProps & DispatchProps) | any): JSX.Element => {
  const {
    color, name, lat, lng, link,
  } = props;
  const intersectionOnClick = (lat: number, lng: number): void => {
    const {
      defaultDistrictLat,
      defaultDistrictLng,
      districtLat,
      districtLng,
      setDistrictCoord,
    } = props;
    if (districtLat !== lat && districtLng !== lng) {
      setDistrictCoord(lat, lng, 15);
    } else {
      setDistrictCoord(defaultDistrictLat, defaultDistrictLng, 11);
    }
  };

  return (
    <Link to={link} onClick={(): void => intersectionOnClick(lat, lng)}>
      <div className="marker" style={{ backgroundColor: color, cursor: 'pointer' }} title={name} />
    </Link>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  appZoom: state.app.zoom,
  districtLat: state.app.districtLat,
  districtLng: state.app.districtLng,
  defaultDistrictLat: state.app.defaultLat,
  defaultDistrictLng: state.app.defaultLng,
});

const mapDispatchToProps: DispatchProps = {
  setDistrictCoord,
};

export default connect(mapStateToProps, mapDispatchToProps)(Marker);

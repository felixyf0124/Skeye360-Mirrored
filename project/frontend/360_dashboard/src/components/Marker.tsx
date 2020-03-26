import React from 'react';
import { connect } from 'react-redux';
import '../css/Marker.css';
import { Link } from 'react-router-dom';
import { setDistrictCoord, SetCoordAction } from '../contexts/app';
import { RootState } from '../reducers/rootReducer';
import { SKEYE_GREEN, SKEYE_RED } from '../css/custom';

interface Props {
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
  selectedIntersection: string;
}

interface DispatchProps {
  setDistrictCoord: (
    selectedIntersection: string,
    lat: number,
    lng: number,
    zoom: number,
  ) => SetCoordAction;
}

const Marker = (props: (Props & StateProps & DispatchProps) | any): JSX.Element => {
  const {
    name, lat, lng, link,
  } = props;
  const intersectionOnClick = (selectedIntersection: string, lat: number, lng: number): void => {
    const {
      defaultDistrictLat,
      defaultDistrictLng,
      districtLat,
      districtLng,
      setDistrictCoord,
    } = props;
    if (districtLat !== lat && districtLng !== lng) {
      setDistrictCoord(selectedIntersection, lat, lng, 15);
    } else {
      setDistrictCoord('none', defaultDistrictLat, defaultDistrictLng, 11);
    }
  };

  const getColor = (): string => {
    const { selectedIntersection, name } = props;
    if (selectedIntersection === name) {
      return SKEYE_GREEN;
    }
    return SKEYE_RED;
  };

  return (
    <Link to={link} onClick={(): void => intersectionOnClick(name, lat, lng)}>
      <div
        className="marker"
        style={{ backgroundColor: getColor(), cursor: 'pointer' }}
        title={name}
      />
    </Link>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  appZoom: state.app.zoom,
  districtLat: state.app.districtLat,
  districtLng: state.app.districtLng,
  defaultDistrictLat: state.app.defaultLat,
  defaultDistrictLng: state.app.defaultLng,
  selectedIntersection: state.app.selectedIntersection,
});

const mapDispatchToProps: DispatchProps = {
  setDistrictCoord,
};

export default connect(mapStateToProps, mapDispatchToProps)(Marker);

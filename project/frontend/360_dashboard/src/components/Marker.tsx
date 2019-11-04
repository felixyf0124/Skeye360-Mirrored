import React from 'react';
import { connect } from 'react-redux';
import '../css/Marker.css';
import { Link } from 'react-router-dom';
import { RootState } from '../reducers/rootReducer';

interface Props {
  color: string;
  name: string;
  link: string;
}

const Marker = (props: Props | any) => {
  const { color, name, link } = props;
  return (
    <Link to={link}>
      <div
        className="marker"
        style={{ backgroundColor: color, cursor: 'pointer' }}
        title={name}
      />
    </Link>
  );
};

export default Marker;

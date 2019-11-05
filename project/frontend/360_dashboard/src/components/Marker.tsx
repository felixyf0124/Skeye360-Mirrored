import React from 'react';
import '../css/Marker.css';
import { Link } from 'react-router-dom';

interface Props {
  color: string;
  name: string;
  link: string;
}

const Marker = (props: Props | any): JSX.Element => {
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

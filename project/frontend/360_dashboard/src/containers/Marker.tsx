import React from 'react';
import '../css/Marker.css';

const Marker = (props: any) => {
    const { color, name, link, id } = props;
    return (

        <a href={link}>
        <div className="marker"
        style={{ backgroundColor: color, cursor: 'pointer'}}
        title={name}>
        </div>
        </a>
    );
  };

  export default Marker;
// https://levelup.gitconnected.com/reactjs-google-maps-with-custom-marker-ece0c7d184c4

import React from 'react';
import '../css/Marker.css';

const Marker = (props: any) => {
    const { color, name, link } = props;
    return (
        <a href={link}>
            <div
                className="marker"
                style={{ backgroundColor: color, cursor: 'pointer'}}
                title={name}
            />
        </a>
    );
};

export default Marker;
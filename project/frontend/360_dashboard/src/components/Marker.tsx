import React from 'react';
import { RootState } from '../reducers/rootReducer';
import { connect } from 'react-redux';
import { viewStreet } from '../contexts/streetview'
import '../css/Marker.css';

interface Props {
    streaming_map: boolean;
}

interface DispatchProps {
    viewStreet: () => any;
}

const Marker = (props: any & Props & DispatchProps) => {
    const { color, name, link } = props;
    return (
        <a href={link} onClick={props.viewStreet}>
            <div
                className="marker"
                style={{ backgroundColor: color, cursor: 'pointer'}}
                title={name}
            />
        </a>
    );
};

const mapStateToProps = (state: RootState): Props => ({
    streaming_map: state.streetview.streaming_map,
  });
  
  const mapDispatchToProps: DispatchProps = {
    viewStreet,
  };
  
  export default connect(
    mapStateToProps,
    mapDispatchToProps,
  )(Marker);
import React from 'react';
import { connect } from 'react-redux';
import '../css/Marker.css';
import { Link } from 'react-router-dom';
import { RootState } from '../reducers/rootReducer';

interface Props {
}

interface DispatchProps {
}

const Marker = (props: any & Props & DispatchProps) => {
  const { color, name, link } = props;
  return (
    <Link to="/streetview">
      <div
        className="marker"
        style={{ backgroundColor: color, cursor: 'pointer' }}
        title={name}
      />
    </Link>
  );
};

const mapStateToProps = (state: RootState): Props => ({
});

const mapDispatchToProps: DispatchProps = {
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Marker);

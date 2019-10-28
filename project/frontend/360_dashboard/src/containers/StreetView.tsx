import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import GoogleMap from '../components/GoogleMap';
// import Simulator from '../containers/simulator/Scene';
import { Redirect, Link } from 'react-router-dom';
import Header from '../components/Header';
import Simulator from './simulator/Scene';
import { Head } from '../components/Header';

interface Props {
  authenticated: boolean;
}

const StreetView = ({ authenticated }: Props):JSX.Element => {
  if (!authenticated) return <Redirect push to={'/login'} />;

  return (
    <div>
      <Header />
        <Head>
          <Link to="/streetview/edit" className="header-text">Edit</Link>
        </Head>
      <Simulator />
    </div>
  );
}

const mapStateToProps = (state: RootState): Props => ({
  authenticated: state.authentication.authenticated,
});

export default connect(
  mapStateToProps,
)(StreetView);
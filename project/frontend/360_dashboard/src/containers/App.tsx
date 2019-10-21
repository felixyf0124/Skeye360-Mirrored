import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import Header from '../components/Header';
import Login from '../components/Login';
//import Footer from './components/Footer';
//import LeftPanel from './components/LeftPanel';
// import Scene from '../simulator/Scene'

import '../css/App.css';
import SkeyeMap from '../containers/SkeyeMap';

interface StateProps {
  authenticated: boolean
}

const App = ({ authenticated }: StateProps): JSX.Element => (
  <div>
    <Header />
    {authenticated ? (
      <SkeyeMap />
    ) : (
      <Login />
    )}
    
  </div>
);

const mapStateToProps = (state: RootState): StateProps => ({
  ...state,
  authenticated: state.authentication.authenticated,
});

export default connect(
  mapStateToProps,
)(App);
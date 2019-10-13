import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import Header from '../components/Header';
import Login from '../components/Login';
//import Footer from './components/Footer';
//import LeftPanel from './components/LeftPanel';
// import Scene from '../simulator/Scene'

import '../css/App.css';
// import SkeyeMap from '../containers/SkeyeMap';

interface StateProps {
}

/**
 * @class App
 * @extends {Component}
 */

class App extends React.Component<StateProps> {
  render(): JSX.Element {
    return (
      <div>
        <Header />
        <Login />
        {/* <SkeyeMap /> */}
      </div>
    )
  }

}

const mapStateToProps = (state: RootState): StateProps => ({
  ...state,
});

export default connect(
  mapStateToProps,
)(App);
import React from 'react';
import { connect } from 'react-redux';
//import { BrowserRoute, Route, Switch } from 'react-router-dom';
import { RootState } from './reducers/rootReducer';
import { getHello } from './contexts/hello';
import './App.css';
import Header from './components/Header';
import Login from './components/Login';
//import Footer from './components/Footer';
//import LeftPanel from './components/LeftPanel';
import Scene from './simulator/Scene'

import './App.css';
import SkeyeMap from './containers/SkeyeMap';
import { render } from 'react-dom';
import { jsxAttribute } from '@babel/types';

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
        <Scene/>
        <Header />
        <Login />
        <SkeyeMap />
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
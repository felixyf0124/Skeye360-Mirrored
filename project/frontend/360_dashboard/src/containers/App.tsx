import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import { Route, Switch } from 'react-router-dom';
import Login from '../components/Login';
//import Footer from './components/Footer';
//import LeftPanel from './components/LeftPanel';
// import Scene from '../simulator/Scene'

import '../css/App.css';
import SkeyeMap from '../containers/SkeyeMap';
import Simulator from '../containers/simulator/Scene';

interface StateProps {
  authenticated: boolean
}

const App = ({ authenticated }: StateProps): JSX.Element => (
  // <div>
  //   <Header />
  //   {authenticated ? (
  //     <SkeyeMap />
  //   ) : (
  //     <Login />
  //   )}
    
  // </div>
  <Switch>
    <Route
      path="/login"
      render={() => <Login />}
    />
    <Route>
      <Switch>
        <Route exact path="/" component={SkeyeMap} />
        <Route exact path="/streetview" component={Simulator} />
      </Switch>
    </Route>
  </Switch>
);

const mapStateToProps = (state: RootState): StateProps => ({
  ...state,
  authenticated: state.authentication.authenticated,
});

export default connect(
  mapStateToProps,
)(App);
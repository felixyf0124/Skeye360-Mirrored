import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { RootState } from '../reducers/rootReducer';
import Login from './Login';
// import Footer from './components/Footer';
// import LeftPanel from './components/LeftPanel';
// import Scene from '../simulator/Scene'

import '../css/App.css';
import SkeyeMap from './SkeyeMap';
import AddCamera from './AddCamera';
import EditCamera from './EditCamera';
import StreetView from './StreetView';
import ChartsPrototype from '../components/ChartsPrototype';

interface StateProps {
  authenticated: boolean;
}

const App = (): JSX.Element => (
  <Switch>
    <Route
      path="/login"
      render={(): JSX.Element => <Login />}
    />
    <Route>
      <Switch>
        <Route exact path="/" component={SkeyeMap} />
        <Route exact path="/streetview" component={StreetView} />
        <Route exact path="/streetview/add" component={AddCamera} />
        <Route exact path="/streetview/edit" component={EditCamera} />
        <Route exact path="/chartsprototype" component={ChartsPrototype} />
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

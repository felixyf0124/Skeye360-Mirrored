import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { RootState } from '../reducers/rootReducer';
import Login from './Login';
// import Footer from './components/Footer';
// import LeftPanel from './components/LeftPanel';

import '../css/App.css';
import SkeyeMap from './SkeyeMap';
import AddIntersection from './AddIntersection';
import EditIntersection from './EditIntersection';
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
        <Route exact path="/streetview/:intersectionId" component={StreetView} />
        <Route exact path="/intersection/add" component={AddIntersection} />
        <Route exact path="/intersection/edit/:intersectionId" render={(): JSX.Element => <EditIntersection />} />
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

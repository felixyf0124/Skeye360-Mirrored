import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { RootState } from './reducers/rootReducer';
import Login from './containers/Login';

import './css/App.css';
import SkeyeMap from './containers/SkeyeMap';
import AddIntersection from './containers/AddIntersection';
import EditIntersection from './containers/EditIntersection';
import StreetView from './containers/StreetView';
import ChartsPrototype from './components/ChartsPrototype';
import SessionRoutes from './SessionRoutes';

interface StateProps {
  authenticated: boolean;
}

const App = ({ authenticated }: StateProps): JSX.Element => (
  <Switch>
    <Route
      path="/login"
      render={(): JSX.Element => <Login />}
    />
    <Route>
      <Switch>
        <SessionRoutes authenticated={authenticated}>
          <Route exact path="/" component={SkeyeMap} />
          <Route exact path="/streetview/:intersectionId" component={StreetView} />
          <Route exact path="/intersection/add" component={AddIntersection} />
          <Route exact path="/intersection/edit/:intersectionId" render={(): JSX.Element => <EditIntersection />} />
          <Route exact path="/chartsprototype" component={ChartsPrototype} />
        </SessionRoutes>
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

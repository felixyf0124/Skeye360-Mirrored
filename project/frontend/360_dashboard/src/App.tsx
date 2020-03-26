import React from 'react';
import { connect } from 'react-redux';
import { Route, Switch } from 'react-router-dom';

import { RootState } from './reducers/rootReducer';
import Login from './containers/Login';

import './css/App.css';
import AddIntersection from './containers/AddIntersection';
import EditIntersection from './containers/EditIntersection';
import ChartsPrototype from './components/charts/ChartsPrototype';
import SessionRoutes from './SessionRoutes';
import { authenticated, isStaff } from './contexts/authentication';
import Home from './containers/Home';
import CamView from './containers/CamView';
import AdminRoutes from './AdminRoutes';

interface StateProps {
  authenticated: boolean;
  isStaff: boolean;
}

// eslint-disable-next-line no-shadow
const App = ({ authenticated, isStaff }: StateProps): JSX.Element => (
  <Switch>
    <Route path="/login" render={(): JSX.Element => <Login />} />
    <Route>
      <Switch>
        <SessionRoutes authenticated={authenticated}>
          <Route exact path="/" component={Home} />
          <Route exact path="/camview/:intersectionId" component={CamView} />
          <Route exact path="/chartsprototype" component={ChartsPrototype} />
          <AdminRoutes authenticated={authenticated} isStaff={isStaff}>
            <Route exact path="/intersection/add" component={AddIntersection} />
            <Route
              exact
              path="/intersection/edit/:intersectionId"
              render={(): JSX.Element => <EditIntersection />}
            />
          </AdminRoutes>
        </SessionRoutes>
      </Switch>
    </Route>
  </Switch>
);

const mapStateToProps = (state: RootState): StateProps => ({
  ...state,
  authenticated: authenticated(state),
  isStaff: isStaff(state),
});

export default connect(mapStateToProps)(App);

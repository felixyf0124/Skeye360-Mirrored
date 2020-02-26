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
import { authenticated, isStaff } from './contexts/authentication';
import IntersectionList from './containers/IntersectionList';
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
          <Route exact path="/" component={IntersectionList} />
          <Route exact path="/streetview/:intersectionId" component={StreetView} />
          <Route exact path="/camview/:intersectionId" component={CamView} />
          <Route exact path="/chartsprototype" component={ChartsPrototype} />
          <Route exact path="/map" component={SkeyeMap} />
          <AdminRoutes isStaff={isStaff}>
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

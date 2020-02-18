import * as React from 'react';
import {
  Route, Redirect, withRouter, RouteComponentProps,
} from 'react-router-dom';

interface Props extends RouteComponentProps {
  authenticated: boolean;
  children?: React.ReactNode;
}

// Handles and checks authentication to see if the user is logged in
const SessionRoutes = (props: Props): JSX.Element => {
  const {
    authenticated, location, children, ...rest
  } = props;
  if (authenticated) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Route {...rest} render={(): React.ReactNode => children} />;
  }

  return <Redirect to={{ pathname: '/login', search: location && location.search }} />;
};

export default withRouter(SessionRoutes);

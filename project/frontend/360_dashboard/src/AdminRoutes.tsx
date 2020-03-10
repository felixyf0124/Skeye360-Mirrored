import * as React from 'react';
import {
  Route, Redirect, withRouter, RouteComponentProps,
} from 'react-router-dom';

interface Props extends RouteComponentProps {
  authenticated: boolean;
  isStaff: boolean;
  children?: React.ReactNode;
}

// Handles and checks authentication to see if the logged in user is a staff
const AdminRoutes = (props: Props): JSX.Element => {
  const {
    authenticated, isStaff, location, children, ...rest
  } = props;
  if (authenticated && isStaff) {
    // eslint-disable-next-line react/jsx-props-no-spreading
    return <Route {...rest} render={(): React.ReactNode => children} />;
  }

  return <Redirect to={{ pathname: '/', search: location && location.search }} />;
};

export default withRouter(AdminRoutes);

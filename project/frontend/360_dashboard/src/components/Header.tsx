import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Redirect, Link } from 'react-router-dom';
import { RootState } from '../reducers/rootReducer';
import { logout } from '../contexts/authentication';

export const Head = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding-left: 1.5rem;
  text-align: center;
  position: relative;
  height: 3rem;
  align-items: center;
`;

interface StateProps {
    authenticated: boolean;
}

interface DispatchProps {
    logout: () => any;
    handleMapButton: () => void;
}

const handleMapButton = (): JSX.Element => <Redirect push to="/" />;

const Header = (props: StateProps & DispatchProps): JSX.Element => {
  const [state] = React.useState(props);

  return (
    <nav className="navbar">
      <Head>
        { state.authenticated ? (
          <div className="nav-links">
            <div className="map">
              <Link to="/" className="nav-text">Map</Link>
            </div>
            <div className="map">
              <Link to="/streetview/add" className="nav-text">Add Marker</Link>
            </div>
            <div className="map">
              <Link to="/chartsprototype" className="nav-text">Charts</Link>
            </div>
          </div>
        ) : (
          <div />
        ) }
        <div className="container">
          <Link to="/" className="header-text">Skeye 360</Link>
        </div>
        {state.authenticated ? (
          <div className="logout">
            <a
              href="/"
              onClick={state.logout}
              className="nav-text"
            >
              Logout
            </a>
          </div>
        ) : (
          <div />
        ) }
      </Head>
    </nav>
  );
};

const mapStateToProps = (state: RootState): StateProps => ({
  authenticated: state.authentication.authenticated,
});

const mapDispatchToProps: DispatchProps = {
  logout,
  handleMapButton: () => handleMapButton(),
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);

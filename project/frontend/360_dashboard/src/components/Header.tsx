/* eslint-disable @typescript-eslint/camelcase */
import React from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { Redirect, Link } from 'react-router-dom';
import { RootState } from '../reducers/rootReducer';
import { logout } from '../contexts/authentication';
import { logClick } from '../contexts/LogClicks';

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
    user_id: number;
    log_message: string;
}

interface DispatchProps {
    logout: () => any;
    handleMapButton: () => void;
    logClick: (
      log_message: string,
      user_id: number,
    ) => any;
}

const handleMapButton = (): JSX.Element => <Redirect push to="/" />;

const Header = (props: StateProps & DispatchProps): JSX.Element => {
  const [state, setState] = React.useState(props);
  // const {
  //   user_id,
  //   log_message,
  // } = props;
  const { user_id } = props;
  const { logout } = props;
  const handleLogout = (): void =>  {
    
      
    const { logClick } = props;
    logClick("Logged out", user_id);
    setState({...state, logout});
    
  }

  return (
    <nav className="navbar">
      <Head>
        { state.authenticated ? (
          <div className="nav-links">
            <div className="map">
              <Link to="/" className="nav-text">Map</Link>
            </div>
            <div className="map">
              <Link to="/intersection/add" className="nav-text">Add Marker</Link>
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
              onClick={ handleLogout }
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
  user_id: state.authentication.user_id,
  log_message: '',
});

const mapDispatchToProps: DispatchProps = {
  logout,
  handleMapButton: () => handleMapButton(),
  logClick,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Header);

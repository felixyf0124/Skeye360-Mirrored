import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import styled from 'styled-components';
import { logout } from '../contexts/authentication';
import { exitStreetView } from '../contexts/streetview';

const Head = styled.div`
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
    streaming_map: boolean;
}

interface DispatchProps {
    logout: () => any;
    exitStreetView: () => any;
}

const Header = (props: StateProps & DispatchProps): JSX.Element => (
    <nav className = "navbar">
        <Head>
            {props.streaming_map && props.authenticated ? (
                <div className="map">
                    <a href="#map" onClick={
                        props.exitStreetView
                    } className="header-text">Map</a>
                </div>
            ) : (
                <div />
            ) }
            <div className="container">
                <a href="/" className="header-text">Skeye 360</a>
            </div>
            {props.authenticated ? (
                <div className="logout">
                    <a href="#logout" onClick={
                        props.logout
                    } className="header-text">Logout</a>
                </div>
            ) : (
                <div />
            ) }
        </Head>
    </nav> 
);

const mapStateToProps = (state: RootState): StateProps => ({
    authenticated: state.authentication.authenticated,
    streaming_map: state.streetview.streaming_map,
});

const mapDispatchToProps: DispatchProps = {
    logout,
    exitStreetView,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
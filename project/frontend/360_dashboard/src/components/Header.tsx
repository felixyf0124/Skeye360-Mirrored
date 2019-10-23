import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import styled from 'styled-components';
import { logout } from '../contexts/authentication';
import { Redirect, Link } from 'react-router-dom';

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

const handleMapButton = () => {
    console.log("handleMapButton");
    return <Redirect push to={'/'} />;
};

const Header = (props: StateProps & DispatchProps): JSX.Element => {

    return (
        <nav className = "navbar">
            <Head>
                { props.authenticated ? (
                    <div>
                        <div className="map">
                            <Link to="/" className="header-text">Map</Link>
                        </div>
                        <div className="map">
                            <Link to="/streetview/add" className="header-text">Add</Link>
                        </div>
                    </div>
                ) : (
                    <div />
                ) }
                <div className="container">
                    <Link to="/" className="header-text">Skeye 360</Link>
                </div>
                {props.authenticated ? (
                    <div className="logout">
                        <a href="/" onClick={
                            props.logout
                        } className="header-text">Logout</a>
                    </div>
                ) : (
                    <div />
                ) }
            </Head>
        </nav>
    );
}

const mapStateToProps = (state: RootState): StateProps => ({
    authenticated: state.authentication.authenticated,
});

const mapDispatchToProps: DispatchProps = {
    logout,
    handleMapButton: () => handleMapButton(),
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
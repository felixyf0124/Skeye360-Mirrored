import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import styled from 'styled-components';
import { logout } from '../contexts/authentication';

const Head = styled.div`
  display: flex;
  box-sizing: border-box;
  width: 100%;
  padding-left: 1.5rem;
  text-align: left;
  position: relative;
  height: 3rem;
  align-items: left;
`;

interface StateProps {
    authenticated: boolean;
}

interface DispatchProps {
    logout: () => any;
}

const Header = (props: StateProps & DispatchProps): JSX.Element => (
    <nav className = "navbar">
        <Head>
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
});

const mapDispatchToProps: DispatchProps = {
    logout,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
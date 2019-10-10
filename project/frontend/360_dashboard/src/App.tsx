import React from 'react';
import { connect } from 'react-redux';
import { RootState } from './reducers/rootReducer';
import './App.css';
import SkeyeMap from './containers/SkeyeMap';

interface StateProps {
}

/**
 * @class App
 * @extends {Component}
 */
class App extends React.Component<StateProps> {
  render(): JSX.Element {
    return (
      <SkeyeMap />
    );
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  ...state,
});

export default connect(
  mapStateToProps,
)(App);
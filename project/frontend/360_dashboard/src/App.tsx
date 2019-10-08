import React from 'react';
import { connect } from 'react-redux';
import { RootState } from './reducers/rootReducer';
import './App.css';
// import Hello from './components/Hello';
import SkeyeMap from './containers/SkeyeMap';

interface StateProps {
  // stateMsg: string;
}

/**
 * @class App
 * @extends {Component}
 */
class App extends React.Component<StateProps> {
  render(): JSX.Element {
    return (
      // <Hello state={this.props} />
      <SkeyeMap />
    );
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  ...state,
  // stateMsg: "stateMsg",
});

export default connect(
  mapStateToProps,
)(App);
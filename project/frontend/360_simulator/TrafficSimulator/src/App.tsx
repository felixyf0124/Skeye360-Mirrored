import React from 'react';
import { connect } from 'react-redux';
import { RootState } from './reducers/rootReducer';
import { getHello } from './contexts/hello';
import  Scene  from './components/scene.js';
import logo from './logo.svg';
import './App.css';

interface StateProps {
  // stateMsg: string;
}

interface DispatchProps {
  getHello: () => any;
}

/**
 * @class App
 * @extends {Component}
 */
class App extends React.Component<StateProps & DispatchProps> {
  public componentDidMount(): void {
    // eslint-disable-next-line no-shadow
    const { getHello } = this.props;
    getHello();
  }

  render(): JSX.Element {
    return (
      <div className="App">
        
        <Scene></Scene>
      </div>
    );
  }
}

const mapStateToProps = (state: RootState): StateProps => ({
  ...state,
  // stateMsg: "stateMsg",
});

export default connect(
  mapStateToProps,
  { getHello },
)(App);

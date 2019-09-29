import React from 'react';
import { connect } from 'react-redux';
import { RootState } from './reducers/rootReducer';
import { getHello } from './contexts/hello';
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
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
          <pre>
            {
              JSON.stringify(this.props)
            }
          </pre>
        </header>
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

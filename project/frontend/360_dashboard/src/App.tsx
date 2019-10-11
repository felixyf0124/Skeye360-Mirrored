import React from 'react';
import { connect } from 'react-redux';
//import { BrowserRoute, Route, Switch } from 'react-router-dom';
import { RootState } from './reducers/rootReducer';
import { getHello } from './contexts/hello';
import './App.css';
import Header from './components/Header';
import Login from './components/Login'; 
//import Footer from './components/Footer';
//import LeftPanel from './components/LeftPanel';


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
      <div>
        <Header />
        <Login />
      </div>
    )}
}

const mapStateToProps = (state: RootState): StateProps => ({
  ...state,
  // stateMsg: "stateMsg",
});

export default connect(
  mapStateToProps,
  { getHello },
)(App);

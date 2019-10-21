import React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../reducers/rootReducer';
import logo from '../logo.svg';
import { getHello, GetHelloAction } from '../contexts/hello';

interface Props {
  hello: GetHelloAction;
}

function Hello(hello: any): JSX.Element {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <h1 className="App-title">Welcome to React</h1>
        <pre>
          {
            JSON.stringify(hello)
          }
        </pre>
      </header>
    </div>
  );
}

const mapStateToProps = (state: RootState): Props => ({
  ...state,
  hello: getHello(),
});

export default connect(
  mapStateToProps,
)(Hello);
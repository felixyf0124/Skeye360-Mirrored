import React from 'react';
import logo from './logo.svg';
import './App.css';

import DashBoard from './Components/DashBoard/DashBoard'
import Toggle from './Components/Toggles/Toggle'
import TogglePage from './Pages/TogglePage'


function App() {
  return (
    <div className="App">
      <header >
        {/*<header className="App-header">*/}
        {/*<img src={logo} className="App-logo" alt="logo" />*/}
        {/*<p>*/}
        {/*  Edit <code>src/App.js</code> and save to reload.*/}
        {/*</p>*/}
        {/*<a*/}
        {/*  className="App-link"*/}
        {/*  href="https://reactjs.org"*/}
        {/*  target="_blank"*/}
        {/*  rel="noopener noreferrer"*/}
        {/*>*/}
        {/*  Learn React*/}
        {/*</a>*/}
      </header>
        <div>
            <TogglePage/>
        </div>

    </div>
  );
}

export default App;

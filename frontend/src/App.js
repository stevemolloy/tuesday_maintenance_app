import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

import './App.css';
import Content from './Content';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>
          MAX-IV Maintenance Tasks
        </h1>
      </header>
      <Content/>
    </div>
  );
}

export default App;

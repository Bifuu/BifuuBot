import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

import Sounds from './pages/Sounds';
import Twitch from './pages/Twitch';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/sounds">Sounds</Link>
            </li>
            <li>
              <Link to="/twitch">Twitch Alerts</Link>
            </li>
          </ul>
        </header>
        <div>
          <Switch>
            <Route path="/sounds">
              <Sounds />
            </Route>
            <Route path="/twitch">
              <Twitch />
            </Route>
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </div>
      </div>
    </Router>
  );
}

export default App;

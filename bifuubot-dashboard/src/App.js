import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link as RouterLink,
} from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import Sounds from './pages/Sounds';
import Twitch from './pages/Twitch';
import Home from './pages/Home';

function App() {
  return (
    <Router>
      <Container>
        <div className="App">
          <div className="nav">
            <ul>
              <li>
                <RouterLink to="/">Home</RouterLink>
              </li>
              <li>
                <RouterLink to="/sounds">Sounds</RouterLink>
              </li>
            </ul>
          </div>
          <main>
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
          </main>
        </div>
      </Container>
    </Router>
  );
}

export default App;

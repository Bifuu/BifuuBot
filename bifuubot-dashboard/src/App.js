import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';

import Sounds from './pages/Sounds';
import Twitch from './pages/Twitch';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import { UserProvider } from './providers/UserProvider';

import Nav from './components/Nav';

function App() {
  return (
    <UserProvider>
      <Router>
        <Container>
          <div className="App">
            <Nav />
            <main>
              <Switch>
                <Route path="/sounds">
                  <Sounds />
                </Route>
                <Route path="/twitch">
                  <Twitch />
                </Route>
                <Route path="/signin" component={SignIn} />

                <Route path="/">
                  <Home />
                </Route>
              </Switch>
            </main>
          </div>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;

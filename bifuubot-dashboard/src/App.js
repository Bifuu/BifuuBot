import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

import Sounds from './pages/Sounds';
import Twitch from './pages/Twitch';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import { UserProvider } from './providers/UserProvider';

import Nav from './components/Nav';
import Sidebar from './components/Sidebar';

function App() {
  return (
    <UserProvider>
      <Router>
        <Container fluid>
          <Nav />

          <Row>
            <Col xs={1}>
              <Sidebar />
            </Col>
            <Col>
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
            </Col>
          </Row>
        </Container>
      </Router>
    </UserProvider>
  );
}

export default App;

import React from 'react';
import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';

const Sidebar = () => {
  return (
    <Nav className="flex-column">
      <LinkContainer to="/sounds">
        <Nav.Link>Sounds</Nav.Link>
      </LinkContainer>

      <Nav.Link href="/">Twitch Alerts</Nav.Link>
      <Nav.Link href="/">Twitter Alerts</Nav.Link>
      <Nav.Link href="/">TBA</Nav.Link>
    </Nav>
  );
};

export default Sidebar;

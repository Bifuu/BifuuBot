import React from 'react';
import Nav from 'react-bootstrap/Nav';

const Sidebar = () => {
  return (
    <Nav className="flex-column">
      <Nav.Link href="/sounds">Sounds</Nav.Link>
      <Nav.Link href="/">Twitch Alerts</Nav.Link>
      <Nav.Link href="/">Twitter Alerts</Nav.Link>
      <Nav.Link href="/">TBA</Nav.Link>
    </Nav>
  );
};

export default Sidebar;

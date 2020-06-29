import React from 'react';
import Nav from 'react-bootstrap/Nav';
import styled from 'styled-components';
import { LinkContainer } from 'react-router-bootstrap';

const Sidebarstyled = styled(Nav)`
  box-shadow: inset -1px 0 0 rgba(0, 0, 0, 0.1);
  height: 100%;
`;

const Sidebaritem = styled(Nav.Link)`
  flex-grow: 1;
`;

const Sidebar = () => {
  return (
    <Sidebarstyled className="d-flex align-content-start">
      <LinkContainer to="/sounds">
        <Sidebaritem>Sounds</Sidebaritem>
      </LinkContainer>

      <Sidebaritem href="/">Twitch Alerts</Sidebaritem>
      <Sidebaritem href="/">Twitter Alerts</Sidebaritem>
      <Sidebaritem href="/">TBA</Sidebaritem>
    </Sidebarstyled>
  );
};

export default Sidebar;

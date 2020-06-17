import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { auth, functions } from '../services/firebase';
import { UserContext } from '../providers/UserProvider';
import Navbar from 'react-bootstrap/Navbar';
import { LinkContainer } from 'react-router-bootstrap';

const Nav = () => {
  const user = useContext(UserContext);

  const signInOrOut = () => {
    if (typeof user !== 'undefined') {
      return (
        <>
          <Navbar.Text>
            <button onClick={() => auth.signOut()}>Sign Out</button>
          </Navbar.Text>
        </>
      );
    } else {
      return (
        <Navbar.Text>
          <RouterLink to="/signin">Sign in</RouterLink>
        </Navbar.Text>
      );
    }
  };
  return (
    <Navbar>
      <LinkContainer to="/">
        <Navbar.Brand>Bifuu Bot</Navbar.Brand>
      </LinkContainer>
      <Navbar.Collapse className="justify-content-end">
        {signInOrOut()}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Nav;

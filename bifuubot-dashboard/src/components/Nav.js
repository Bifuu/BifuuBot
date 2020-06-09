import React, { useContext } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { auth, functions } from '../services/firebase';
import { UserContext } from '../providers/UserProvider';

const Nav = () => {
  const user = useContext(UserContext);

  const signInOrOut = () => {
    if (typeof user !== 'undefined') {
      return (
        <>
          <li>
            <RouterLink to="/sounds">Sounds</RouterLink>
          </li>
          <li>
            <button onClick={() => auth.signOut()}>Sign Out</button>
          </li>
        </>
      );
    } else {
      return (
        <li>
          <RouterLink to="/signin">Sign in</RouterLink>
        </li>
      );
    }
  };
  return (
    <div className="nav">
      <ul>
        <li>
          <RouterLink to="/">Home</RouterLink>
        </li>
        {signInOrOut()}
      </ul>
    </div>
  );
};

export default Nav;

import React, { createContext, useState, useEffect } from 'react';
import { auth, generateUserDocument } from '../services/firebase';

export const UserContext = createContext({ user: null });

export const UserProvider = (props) => {
  const [user, setUser] = useState(null);
  useEffect(() => {
    auth.onAuthStateChanged(async (userAuth) => {
      const userData = await generateUserDocument(userAuth);
      console.log(`User data:`, userData);
      setUser(userData);
    });
  }, [props]);

  return (
    <UserContext.Provider value={user}>{props.children}</UserContext.Provider>
  );
};

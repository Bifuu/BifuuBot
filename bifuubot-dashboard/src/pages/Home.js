import React, { useContext } from 'react';
import { UserContext } from '../providers/UserProvider';

const Home = () => {
  const user = useContext(UserContext);
  return <div>Home Page for {user?.username}</div>;
};

export default Home;

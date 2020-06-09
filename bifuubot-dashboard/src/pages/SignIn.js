import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../services/firebase';
import queryString from 'query-string';
import { UserContext } from '../providers/UserProvider';

const SignIn = (props) => {
  const user = useContext(UserContext);
  const history = useHistory();
  const { code, state } = queryString.parse(props.location.search);
  useEffect(() => {
    if (!code) {
      window.location.href =
        'https://us-central1-bifuubot.cloudfunctions.net/DiscordAuth-Redirect';
    } else {
      const options = {
        method: 'GET',
        cors: true, // allow cross-origin HTTP request
        credentials: 'include',
      };
      fetch(
        `https://us-central1-bifuubot.cloudfunctions.net/DiscordAuth-Token?code=${code}&state=${state}`,
        options
      )
        .then((res) => res.json())
        .then((json) =>
          auth.signInWithCustomToken(json.token).then(history.push('/'))
        );
    }
  }, [props]);

  return <div>Signing in.....</div>;
};

export default SignIn;

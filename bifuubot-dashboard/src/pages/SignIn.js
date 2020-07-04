import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { auth } from '../services/firebase';
import queryString from 'query-string';
import { firebaseConfig } from '../config.json';

const SignIn = (props) => {
  const history = useHistory();

  useEffect(() => {
    const { code, state } = queryString.parse(props.location.search);
    const baseUrl =
      process.env.NODE_ENV !== 'production'
        ? `http://localhost:5001/${firebaseConfig.projectId}/us-central1/`
        : `https://us-central1-${firebaseConfig.projectId}.cloudfunctions.net/`;

    if (!code) {
      window.location.href = `${baseUrl}DiscordAuth-Redirect`;
    } else {
      const options = {
        method: 'GET',
        cors: true, // allow cross-origin HTTP request
        credentials: 'include',
      };
      fetch(`${baseUrl}DiscordAuth-Token?code=${code}&state=${state}`, options)
        .then((res) => res.json())
        .then((json) =>
          auth.signInWithCustomToken(json.token).then(history.push('/'))
        );
    }
  }, [props, history]);

  return <div>Signing in.....</div>;
};

export default SignIn;

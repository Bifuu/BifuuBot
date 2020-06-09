import * as functions from 'firebase-functions';
import admin from 'firebase-admin';

import serviceAccount from './config.json';

import Oauth from 'discord-oauth2';
import cookieParser from 'cookie-parser';
import crypto from 'crypto';

const oauth = new Oauth({
  clientId: serviceAccount.discord_clientId,
  clientSecret: serviceAccount.discord_client_secret,
  redirectUri: 'https://bifuubot.web.app/signin', // TODO: Automate/put in variable for testing
});

export const Redirect = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');

  cookieParser()(req, res, () => {
    const state =
      (req.cookies.state as string) || crypto.randomBytes(20).toString('hex');
    console.log('Setting state', state);
    res.cookie('state', state.toString(), {
      maxAge: 3600000,
      secure: true,
      httpOnly: true,
    });
    const DiscordAuthUrl = oauth.generateAuthUrl({
      scope: ['identify', 'guilds'],
      state,
    });
    res.redirect(DiscordAuthUrl);
  });
});

export const Token = functions.https.onRequest(async (req, res) => {
  res.set('Access-Control-Allow-Origin', 'https://bifuubot.web.app'); // TODO: Automate/put origin in variable for testing
  res.set('Access-Control-Allow-Methods', 'GET, PUT, POST, OPTIONS');
  res.set('Access-Control-Allow-Credentials', 'true');

  try {
    return cookieParser()(req, res, async () => {
      if (!req.cookies.state) {
        throw new Error('State cookie not set or expired. Try again');
      } else if (req.cookies.state !== req.query.state) {
        throw new Error('State verification failed!!!!!!');
      }
      const discordData = await oauth.tokenRequest({
        grantType: 'authorization_code',
        code: req.query.code as string,
        scope: ['identify', 'guilds'],
      });

      const firebaseToken = await createFirebaseAccount(
        discordData.access_token
      );

      return res.json({ token: firebaseToken });
    });
  } catch (error) {
    console.error(error);
  }
});

const createFirebaseAccount = async (accessToken: string) => {
  const userData = await oauth.getUser(accessToken);
  const userGuilds = (await oauth.getUserGuilds(accessToken)).map((pg) => ({
    name: pg.name,
    id: pg.id,
  }));

  // The UID we'll assign to the user.
  const uid = `discord:${userData.id}`;

  // Save the access token to the Firebase Firestore Database.
  const databaseTask = admin.firestore().doc(`users/${uid}`).set({
    accessToken,
    username: userData.username,
    avatar: userData.avatar,
    userGuilds,
  });

  // Create or update the user account.
  const userCreationTask = admin
    .auth()
    .updateUser(uid, {
      displayName: userData.username,
    })
    .catch((error) => {
      // If user does not exists we create it.
      if (error.code === 'auth/user-not-found') {
        return admin.auth().createUser({
          uid: uid,
          displayName: userData.username,
        });
      }
      throw error;
    });

  // Wait for all async tasks to complete, then generate and return a custom auth token.
  await Promise.all([userCreationTask, databaseTask]);

  // There must be a cleaner and better way to do this...
  const botGuilds = await admin.firestore().collection('guildsIn').get();
  botGuilds.forEach(async (doc) => {
    console.log(`${doc.data().guildId} is being checked`);
    if (userGuilds.find((g) => g.id === doc.data().guildId)) {
      await admin.auth().setCustomUserClaims(uid, { inGuild: true });
      console.log('set custom claim');
    }
  });

  // Create a Firebase custom auth token.
  const token = await admin.auth().createCustomToken(uid);
  console.log('Created Custom token for UID "', uid, '" Token:', token);
  return token;
};

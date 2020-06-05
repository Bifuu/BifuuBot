import * as Discord from 'discord.js';
import { token, firebase as serviceAccount } from './config.json';
import fs from 'fs';
import path from 'path';
import ping from './commands/ping';
import { ICommand } from './interfaces/ICommand';
import SoundEffect from './commands/SoundEffect';
import YTAudio from './commands/YTAudio';
import Apex from './commands/Apex';
import Roll from './commands/Roll';
import TwitchAlert from './commands/TwitchAlert';
import TwitchService from './services/twitch';
import admin, { ServiceAccount } from 'firebase-admin';
import './services/sounds';
import SoundService from './services/sounds';

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as ServiceAccount),
  storageBucket: 'bifuubot.appspot.com',
  databaseURL: 'https://bifuubot.firebaseio.com',
});

class BifuuBot extends Discord.Client {
  commands = new Discord.Collection<string, ICommand>();
  services = [];
  constructor(options?: Discord.ClientOptions) {
    super(options);
  }
}
const database = admin.firestore();
const storage = admin.storage();

const client = new BifuuBot();
const prefix = '!';

// This has to be done a better way right? but it works.
const twitchService = new TwitchService(client, database);
const twitchCommand = new TwitchAlert(client, twitchService);
const soundsService = new SoundService(database, storage);

// TODO: Dynamically call these based on files in folder?
client.commands.set(ping.name.toLowerCase(), ping);
client.commands.set(
  SoundEffect.name.toLowerCase(),
  new SoundEffect(soundsService)
);
client.commands.set(YTAudio.name.toLowerCase(), YTAudio);
client.commands.set(Apex.name.toLowerCase(), Apex);
client.commands.set(Roll.name.toLowerCase(), Roll);
client.commands.set(twitchCommand.name.toLowerCase(), twitchCommand);

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', async (message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const commandName = args.shift().toLowerCase();

  const command =
    client.commands.get(commandName) ||
    client.commands.find(
      (cmd) => cmd.aliases && cmd.aliases.includes(commandName)
    );

  if (!command) return;

  if (command.args && !args.length) {
    return message.channel.send('Needs args yo');
  }

  command.execute(message, args);
});

client.login(token);

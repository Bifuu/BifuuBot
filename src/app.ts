import * as Discord from 'discord.js';
import { token } from './config.json';
import fs from 'fs';
import path from 'path';
import ping from './commands/ping';
import { ICommand } from './interfaces/ICommand';
import SoundEffect from './commands/SoundEffect';
import YTAudio from './commands/YTAudio';
import Apex from './commands/Apex';
import Roll from './commands/Roll';
import TwitchAlert from './commands/TwitchAlert';
import twitch from './services/twitch';
import TwitchService from './services/twitch';

class BifuuBot extends Discord.Client {
  commands = new Discord.Collection<string, ICommand>();
  services = [];
  constructor(options?: Discord.ClientOptions) {
    super(options);
  }
}

const client = new BifuuBot();
const prefix = '!';
const twitchService = new TwitchService(client);
const twitchCommand = new TwitchAlert(client, twitchService);

// TODO: Dynamically call these based on files in folder?
client.commands.set(ping.name.toLowerCase(), ping);
client.commands.set(SoundEffect.name.toLowerCase(), SoundEffect);
client.commands.set(YTAudio.name.toLowerCase(), YTAudio);
client.commands.set(Apex.name.toLowerCase(), Apex);
client.commands.set(Roll.name.toLowerCase(), Roll);
client.commands.set(twitchCommand.name.toLowerCase(), twitchCommand);

// TODO: Probably do this in the command somewhere
if (!fs.existsSync(path.join(__dirname, 'sounds'))) {
  console.log(
    'Need to make a foolder names sounds at: ' + path.join(__dirname, 'sounds')
  );
  fs.mkdirSync(path.join(__dirname, 'sounds'));
}

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

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

const client = new Discord.Client();
const prefix = '!';
const commands = new Discord.Collection<string, ICommand>();

// TODO: Dynamically call these based on files in folder?
commands.set(ping.name, ping);
commands.set(SoundEffect.name, SoundEffect);
commands.set(YTAudio.name, YTAudio);
commands.set(Apex.name, Apex);
commands.set(Roll.name, Roll);

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
    commands.get(commandName) ||
    commands.find((cmd) => cmd.aliases && cmd.aliases.includes(commandName));

  if (!command) return;

  if (command.args && !args.length) {
    return message.channel.send('Needs args yo');
  }

  command.execute(message, args);
});

client.login(token);

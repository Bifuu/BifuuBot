import { ICommand } from '../interfaces/ICommand';

const ping: ICommand = {
  name: 'ping',
  description: 'Ping test',
  execute(message: import('discord.js').Message): boolean {
    message.channel.send('Pong!');
    return true;
  },
};

export default ping;

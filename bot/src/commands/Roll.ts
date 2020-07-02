import { ICommand } from '../interfaces/ICommand';
import { Message } from 'discord.js';

const Roll: ICommand = {
  name: 'roll',
  description: 'get a random number from 1-100',
  execute(message: Message) {
    let num: number = Math.random() * 100;

    num = Math.trunc(num);
    message.channel.send(`You rolled a ${num}`);
  },
};

export default Roll;

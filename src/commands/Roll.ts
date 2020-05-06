import { ICommand } from '../interfaces/ICommand';
import { Message } from 'discord.js';

const Roll: ICommand = {
  name: 'roll',
  description: 'get a random number from 1-100',
  execute(message: Message) {
    let num: number = Math.random() * 100;
    if (message.author.id === '151860528203956226') {
      num = num / 10;
    }
    num = Math.trunc(num);
    message.channel.send(`You rolled a ${num}`);
  },
};

export default Roll;

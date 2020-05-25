import { ICommand } from '../interfaces/ICommand';
import { Message } from 'discord.js';

const Apex: ICommand = {
  name: 'apex',
  description: 'Randomizes 2 weapons for you to play with in your next game',
  execute(message: Message) {
    const weapons: string[] = [
      'Mozambique',
      'Eva-8',
      'Peacekeeper',
      'P2020',
      'RE-45',
      'Alternator',
      'R-99',
      'R301',
      'G7 Scout',
      'Wingman',
      'Prowler',
      'Hemlock',
      'Flatline',
      'Spitfire',
      'Havoc',
      'L-Star',
      'Longbow',
      'Triple Take',
      'Sentinel',
      'Charge Rifle',
    ];
    const weapon1: string = weapons[Math.floor(Math.random() * weapons.length)];
    const weapon2: string = weapons[Math.floor(Math.random() * weapons.length)];

    message.channel.send(`1: ${weapon1} 2: ${weapon2}`);
  },
};

export default Apex;

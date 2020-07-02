import { ICommand } from '../interfaces/ICommand';
import { Message } from 'discord.js';
import SoundService from '../services/sounds';

export default class Stop implements ICommand {
  name: string = 'Stop';
  description: string = 'Stops a soundeffect';
  aliases?: string[] = ['shh', 'nope', 'denied'];
  soundService: SoundService;

  constructor(soundService: SoundService) {
    this.soundService = soundService;
  }

  async execute(message: Message, args?: string[]) {
    this.soundService.StopSound(message.guild.id);
    message.delete();
  }
}

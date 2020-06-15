import { ICommand } from '../interfaces/ICommand';
import { Message } from 'discord.js';
import SoundService from '../services/sounds';

export default class SoundEffect implements ICommand {
  name: string = 'SoundEffect';
  description: string = 'Plays a soundeffect';
  aliases?: string[] = ['se'];
  soundService: SoundService;

  constructor(soundService: SoundService) {
    this.soundService = soundService;
  }

  async execute(message: Message, args?: string[]) {
    if (!args.length) {
      // No args, send a list of sounds!
      message.channel.send('Here is a list of sounds I can make: ');
      message.channel.send(this.soundService.GetAvailableSounds().join(', '));
      return; // Exit out of the command execution.
    } else {
      // we have args, lets parse.
      let volumeMultiplier = 1;
      if (args.length > 1) {
        let multInput = parseFloat(args[1]);
        multInput = Math.min(Math.max(0, multInput), 1);
        volumeMultiplier = multInput;
      }

      this.soundService.PlaySound(args[0], message, volumeMultiplier);
    }
  }
}

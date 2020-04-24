import { ICommand } from '../interfaces/ICommand';
import { Message } from 'discord.js';
import fs from 'fs';
import { soundsPath } from '../config.json';

const SoundEffect: ICommand = {
  name: 'soundeffect',
  description: 'Plays a sound effect in your current voice channel',
  args: true,
  aliases: ['se'],
  async execute(message: Message, args: string[]): Promise<boolean> {
    // TODO: Dynamically generate list of available files

    // Join the same voice channel of the author of the message
    if (message.member.voice.channel) {
      const connection = await message.member.voice.channel.join();
      const file: string = `${args[0]}.ogg`;
      const path: string = `${soundsPath}${file}`;
      if (!fs.existsSync(path)) {
        message.channel.send('That sound dont exists to silly billy');
        return false;
      }

      let volumeMult: number = 1;
      if (args.length > 1) {
        volumeMult = parseFloat(args[1]);
        if (volumeMult > 1) volumeMult = 1;
        if (volumeMult < 0) volumeMult = 0;
      }

      // Create a dispatcher
      const dispatcher = connection.play(fs.createReadStream(`${path}`), {
        volume: 0.5 * volumeMult,
        type: 'ogg/opus',
      });

      dispatcher.on('start', () => {
        console.log(`${file} is now playing!`);
        message.delete().catch((err) => {
          console.error(err);
        });
      });

      dispatcher.on('finish', () => {
        console.log(`${file} has finished playing!`);
      });

      // Always remember to handle errors appropriately!
      dispatcher.on('error', console.error);
    }
    return true;
  },
};

export default SoundEffect;

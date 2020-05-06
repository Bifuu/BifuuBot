import { ICommand } from '../interfaces/ICommand';
import { Message } from 'discord.js';
import fs from 'fs';
import path from 'path';

const SoundEffect: ICommand = {
  name: 'soundeffect',
  description: 'Plays a sound effect in your current voice channel',
  args: false,
  aliases: ['se'],
  async execute(message: Message, args: string[]): Promise<boolean> {
    // TODO: Dynamically generate list of available files
    const soundFolder = 'sounds';

    if (!args.length) {
      fs.readdir(path.resolve('build/sounds'), (err, files) => {
        const names: string[] = files.map((f) => f.split('.')[0]);
        message.channel.send(names.join(', '));
      });
      message.channel.send(`List of sounds`);
      return;
    }
    // const soundsFolderPath = path.join(__dirname, '..', soundFolder);

    // Join the same voice channel of the author of the message
    if (args.length && message.member.voice.channel) {
      const file: string = `${args[0]}.ogg`;
      const soundsPath: string = path.join(__dirname, '..', soundFolder, file);

      if (!fs.existsSync(soundsPath)) {
        console.log('No sounds at path: ' + soundsPath);
        message.channel.send('That sound does not exist: ' + args[0]);
        return false;
      }

      const connection = await message.member.voice.channel.join();

      let volumeMult: number = 1;
      if (args.length > 1) {
        volumeMult = parseFloat(args[1]);
        if (volumeMult > 1) volumeMult = 1;
        if (volumeMult < 0) volumeMult = 0;
      }

      // Create a dispatcher
      const dispatcher = connection.play(fs.createReadStream(`${soundsPath}`), {
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

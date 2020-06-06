import { ICommand } from '../interfaces/ICommand';
import { Message } from 'discord.js';
import fs from 'fs';
import path from 'path';
import SoundService from '../services/sounds';

// const SoundEffect: ICommand = {
//   name: 'soundeffect',
//   description: 'Plays a sound effect in your current voice channel',
//   args: false,
//   aliases: ['se'],
//   async execute(message: Message, args: string[]): Promise<boolean> {
//     // TODO: Dynamically generate list of available files
//     const soundFolder = 'sounds';

//     if (!args.length) {
//       fs.readdir(path.resolve('build/sounds'), (err, files) => {
//         const names: string[] = files.map((f) => f.split('.')[0]);
//         message.channel.send(names.join(', '));
//       });
//       message.channel.send(`List of sounds`);
//       return;
//     }
//     // const soundsFolderPath = path.join(__dirname, '..', soundFolder);

//     // Join the same voice channel of the author of the message
//     if (args.length && message.member.voice.channel) {
//       const file: string = `${args[0].toLowerCase()}.ogg`;
//       const soundsPath: string = path.join(__dirname, '..', soundFolder, file);

//       if (!fs.existsSync(soundsPath)) {
//         console.log('No sounds at path: ' + soundsPath);
//         message.channel.send('That sound does not exist: ' + args[0]);
//         return false;
//       }

//       const connection = await message.member.voice.channel.join();

//       let volumeMult: number = 1;
//       if (args.length > 1) {
//         volumeMult = parseFloat(args[1]);
//         if (volumeMult > 1) volumeMult = 1;
//         if (volumeMult < 0) volumeMult = 0;
//       }

//       // Create a dispatcher
//       const dispatcher = connection.play(fs.createReadStream(`${soundsPath}`), {
//         volume: 0.5 * volumeMult,
//         type: 'ogg/opus',
//       });

//       dispatcher.on('start', () => {
//         console.log(`${file} is now playing!`);
//         message.delete().catch((err) => {
//           console.error(err);
//         });
//       });

//       dispatcher.on('finish', () => {
//         console.log(`${file} has finished playing!`);
//       });

//       dispatcher.on('error', (e) => {
//         message.channel.send(e);
//       });

//       // Always remember to handle errors appropriately!
//       dispatcher.on('error', console.error);
//     }
//     return true;
//   },
// };

// export default SoundEffect;

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
      if (!message.member.voice.channel)
        return message.channel.send(`You must be in a voice channel!`);
      if (!message.member.voice.channel.joinable)
        return message.channel.send(`I cannot join your current voice channel`);

      const soundPath = this.soundService.GetSoundPath(args[0]);
      if (!soundPath)
        return message.channel.send(`The sound '${args[0]}' does not exist.`);

      const voiceConnection = await message.member.voice.channel.join();

      let volumeMultiplier = 1;
      if (args.length > 1) {
        let multInput = parseFloat(args[1]);
        multInput = Math.min(Math.max(0, multInput), 1);
        volumeMultiplier = multInput;
      }

      const audioDispatcher = voiceConnection.play(
        fs.createReadStream(`${soundPath}`),
        { volume: 0.5 * volumeMultiplier, type: 'ogg/opus' }
      );

      audioDispatcher.on('start', async () => {
        await message.delete();
      });
    }
  }
}

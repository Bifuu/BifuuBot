import { ICommand } from '../interfaces/ICommand';
import * as ytdl from 'ytdl-core-discord';
import { Message } from 'discord.js';

const YTAudio: ICommand = {
  name: 'ytaudio',
  description: 'Plays ther audio from a provided youtube link',
  args: true,
  aliases: ['yta'],
  async execute(message: Message, args: string[]) {
    const connection = await message.member.voice.channel.join();

    let volumeMult: number = 1;
    if (args.length > 1) {
      volumeMult = parseFloat(args[1]);
      if (volumeMult > 1) volumeMult = 1;
      if (volumeMult < 0) volumeMult = 0;
    }

    const dispatcher = connection.play(await ytdl.default(args[0]), {
      volume: 0.5 * volumeMult,
      type: 'opus',
    });

    dispatcher.on('start', () => {
      console.log(`${args[0]} is now playing!`);
      message.delete().catch((err) => {
        console.error(err);
      });
    });
  },
};

export default YTAudio;

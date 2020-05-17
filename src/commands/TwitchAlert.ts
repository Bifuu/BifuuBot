import { ICommand } from '../interfaces/ICommand';
import TwitchService from '../services/twitch';
import { Client, Message } from 'discord.js';

export default class TwitchAlert implements ICommand {
  client: Client;
  twitchService: TwitchService;
  constructor(client: Client, twtichService: TwitchService) {
    this.client = client;
    this.twitchService = twtichService;
  }

  name = 'TwitchAlert';
  aliases = ['ta', 'twitch'];
  description = 'Alerts channel when streamer goes live';

  execute(message: Message, args: string[]) {
    this.twitchService.followStreamer(args[0], message.channel);
  }
}

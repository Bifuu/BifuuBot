import { Message, Client } from 'discord.js';

export interface ICommand {
  name: string;
  description: string;
  args?: boolean;
  aliases?: string[];
  usage?: string;
  client?: Client;
  service?: any;
  execute(message: Message, args?: string[]): any;
}

import { Message } from 'discord.js';

export interface ICommand {
  name: string;
  description: string;
  args?: boolean;
  aliases?: string[];
  usage?: string;
  execute(message: Message, args?: string[]): any;
}

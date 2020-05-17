import axios, { AxiosResponse } from 'axios';
import {
  Client,
  TextChannel,
  DMChannel,
  NewsChannel,
  Collection,
  MessageEmbed,
} from 'discord.js';
import { twitchClientID as ClientID } from '../config.json';

interface ITwitchAlertFollow {
  username: string;
  id: string;
  reportChannels: string[];
  lastStatus: string;
}

export default class TwitchService {
  private headers = {
    Accept: 'application/vnd.twitchtv.v5+json',
    'Client-ID': ClientID,
  };
  private client: Client;
  private streamersFollowing = new Collection<string, ITwitchAlertFollow>();

  constructor(client: Client) {
    this.client = client;
    // console.log(`Twitch service`);
    setInterval(this.checkForUpdates, 60000);
  }

  getUserId = async (username: string) => {
    const response: AxiosResponse = await axios.get(
      `https://api.twitch.tv/kraken/users?login=${username}`,
      { headers: this.headers }
    );
    // console.log(`[Twitch API] getUserID`);

    if (response.data._total === 0) {
      console.log(`No user found by the name: ${username}`);
      return null;
    } else {
      const streamerid: string = response.data.users[0]._id;
      // console.log(streamerid);
      return streamerid;
    }
  };

  checkStreamStatus = async (id: string) => {
    const response: AxiosResponse = await axios.get(
      `https://api.twitch.tv/kraken/streams/${id}`,
      { headers: this.headers }
    );
    // console.log(`[Twitch API] checkStreamStatus`);
    return response.data.stream;
  };

  checkForUpdates = () => {
    this.streamersFollowing.each(async (streamer) => {
      const status = await this.checkStreamStatus(streamer.id);
      if (!status) {
        // Stream is offline.
        if (streamer.lastStatus === 'online') {
          console.log(streamer.username + 'offline!');
          console.log(status);
          streamer.lastStatus = 'offline';
        }
      } else {
        // Stream is online
        if (streamer.lastStatus === 'offline') {
          streamer.lastStatus = 'online';
          streamer.reportChannels.forEach((channelID) => {
            const embed = new MessageEmbed()
              .setAuthor(`${streamer.username} is Live!`)
              .setTitle(status.channel.status)
              .setURL(status.channel.url)
              .setThumbnail(status.preview.medium);

            (this.client.channels.cache.get(channelID) as TextChannel).send(
              embed
            );
          });
        }
      }
    });
  };

  followStreamer = async (
    streamer: string,
    channel: TextChannel | DMChannel | NewsChannel
  ) => {
    const currentData: ITwitchAlertFollow = this.streamersFollowing.get(
      streamer
    );

    if (!currentData) {
      const streamerID: string = await this.getUserId(streamer);
      if (!streamerID) {
        channel.send(`No streamer by the name ${streamer}`);
        return;
      }

      // No data for this streamID so lets make some new stuff
      const streamerToFollow: ITwitchAlertFollow = {
        username: streamer,
        id: streamerID,
        reportChannels: [channel.id],
        lastStatus: 'offline',
      };
      this.streamersFollowing.set(streamer, streamerToFollow);
    } else {
      // Check to see if we are following this streamer in this channel or not.
      if (currentData.reportChannels.includes(channel.id)) {
        channel.send('Already following that streamer in this channel!');
        return;
      }

      // Add current channel to the list of channels.
      currentData.reportChannels.push(channel.id);
    }

    channel.send(`following ${streamer}`);
    console.log(this.streamersFollowing.toJSON());
  };
}
/*
store list of streamers
{
  streamer:
  id:
  lastStatus:
  channel to report to:
  - {
      channel id:
      requested by:
    }
}
every '60' seconds check twitch api for changes
- if change occurs then post in channel requested.

*/
